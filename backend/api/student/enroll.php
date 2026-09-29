<?php

require_once __DIR__ . "/../core/db.php";

/* ================= HEADERS ================= */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

/* ================= PREFLIGHT ================= */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* ================= BADGE FUNCTIONS ================= */

function addBadge($clerk_id, $title, $desc, $icon) {

    $exists = db()->fetchOne(
        "SELECT id FROM badges WHERE clerk_id = ? AND title = ?",
        [$clerk_id, $title]
    );

    if (!$exists) {

        db()->insert("badges", [
            "clerk_id"   => $clerk_id,
            "title"      => $title,
            "desc"       => $desc,
            "icon"       => $icon,
            "color"      => "#6366f1",
            "created_at" => date("Y-m-d H:i:s")
        ]);

    }
}

function checkBadges($clerk_id) {

    $count = db()->fetchOne(
        "SELECT COUNT(*) as total FROM enrollments WHERE clerk_id = ?",
        [$clerk_id]
    );

    $total = $count["total"] ?? 0;

    /* FIRST COURSE */
    if ($total >= 1) {
        addBadge($clerk_id, "First Course", "You enrolled in your first course", "🎓");
    }

    /* 5 COURSES */
    if ($total >= 5) {
        addBadge($clerk_id, "5 Courses", "You enrolled in 5 courses", "🔥");
    }

    /* 10 COURSES */
    if ($total >= 10) {
        addBadge($clerk_id, "10 Courses", "You enrolled in 10 courses", "💎");
    }

}

/* ================= MAIN ================= */

try {

    /* ================= READ DATA ================= */

    $data = $_POST;

    if (!$data || count($data) === 0) {

        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (!$data) {
            throw new Exception("No data received");
        }
    }

    $clerk_id   = $data["clerk_id"] ?? "";
    $course_id  = $data["course_id"] ?? "";
    $user_email = $data["email"] ?? "";
    $user_name  = $data["name"] ?? "";

    if (!$clerk_id || !$course_id) {
        throw new Exception("Missing required data");
    }

    /* ================= CHECK COURSE ================= */

    $course = db()->fetchOne(
        "SELECT id,title FROM courses WHERE id = ?",
        [$course_id]
    );

    if (!$course) {
        throw new Exception("Course not found");
    }

    /* ================= CHECK USER ================= */

    $user = db()->fetchOne(
        "SELECT * FROM users WHERE clerk_id = ?",
        [$clerk_id]
    );

    /* ================= CREATE USER ================= */

    if (!$user) {

        db()->insert("users", [
            "clerk_id"   => $clerk_id,
            "name"       => $user_name,
            "email"      => $user_email,
            "role"       => "student",
            "created_at" => date("Y-m-d H:i:s")
        ]);

        $user = db()->fetchOne(
            "SELECT * FROM users WHERE clerk_id = ?",
            [$clerk_id]
        );
    }

    $user_id = $user["id"];

    /* ================= CHECK ENROLLMENT ================= */

    $exist = db()->fetchOne(
        "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?",
        [$user_id, $course_id]
    );

    if ($exist) {

        echo json_encode([
            "success" => true,
            "message" => "Already enrolled"
        ]);

        exit;
    }

    /* ================= INSERT ENROLLMENT ================= */

    db()->insert("enrollments", [
        "clerk_id"   => $clerk_id,
        "user_id"    => $user_id,
        "course_id"  => $course_id,
        "progress"   => 0,
        "status"     => "active",
        "created_at" => date("Y-m-d H:i:s")
    ]);

    /* ================= CHECK BADGES ================= */

    checkBadges($clerk_id);

    /* ================= SUCCESS ================= */

    echo json_encode([
        "success" => true,
        "message" => "Enrolled successfully"
    ]);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}