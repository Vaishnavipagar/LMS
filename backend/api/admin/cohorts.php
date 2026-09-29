<?php

error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Content-Type: application/json");

require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

/* ================= CORS ================= */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id");

/* ================= PREFLIGHT ================= */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

/* ================= ADMIN CHECK ================= */

$clerkId = AdminAuth::checkAdminAccess();

try {

    $method = $_SERVER['REQUEST_METHOD'];

    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data) {
        $data = [];
    }

    /* ======================================================
       LIST COHORTS
    ====================================================== */

    if ($method === "GET") {

        $rows = db()->fetchAll("
            SELECT 
                c.id,
                c.title,
                c.course_id,
                c.start_date,
                c.end_date,
                c.max_seats,
                c.seats_filled,
                c.status,
                c.created_at,
                courses.title AS course_title
            FROM cohorts c
            LEFT JOIN courses 
                ON courses.id = c.course_id
            ORDER BY c.start_date DESC
        ");

        echo json_encode([
            "success" => true,
            "data" => $rows ?: []
        ]);
        exit;
    }

    /* ======================================================
       CREATE COHORT
    ====================================================== */

    if ($method === "POST" && ($data['action'] ?? '') !== "delete") {

        $course_id  = $data['course_id'] ?? null;
        $title      = $data['title'] ?? null;
        $start_date = $data['start_date'] ?? null;
        $end_date   = $data['end_date'] ?? null;
        $max_seats  = $data['max_seats'] ?? 50;

        if (!$course_id || !$title) {
            throw new Exception("Missing required fields");
        }

        $course = db()->fetchOne(
            "SELECT id FROM courses WHERE id = ?",
            [$course_id]
        );

        if (!$course) {
            throw new Exception("Invalid course selected");
        }

        $status = "upcoming";

        if ($start_date && $end_date) {

            $today = date("Y-m-d");

            if ($today >= $start_date && $today <= $end_date) {
                $status = "active";
            }

            if ($today > $end_date) {
                $status = "completed";
            }
        }

        db()->insert("cohorts", [
            "course_id" => $course_id,
            "title" => $title,
            "start_date" => $start_date,
            "end_date" => $end_date,
            "max_seats" => $max_seats,
            "status" => $status,
            "seats_filled" => 0
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Cohort created successfully"
        ]);
        exit;
    }

    /* ======================================================
       UPDATE COHORT
    ====================================================== */

    if ($method === "PUT") {

        $id = $data['id'] ?? null;

        if (!$id) {
            throw new Exception("Cohort ID required");
        }

        db()->update(
            "cohorts",
            [
                "title" => $data['title'],
                "start_date" => $data['start_date'],
                "end_date" => $data['end_date'],
                "max_seats" => $data['max_seats']
            ],
            "id = ?",
            [$id]
        );

        echo json_encode([
            "success" => true,
            "message" => "Cohort updated successfully"
        ]);

        exit;
    }

    /* ======================================================
       DELETE COHORT
    ====================================================== */

    if ($method === "DELETE" || ($method === "POST" && ($data['action'] ?? '') === "delete")) {

        $id =
            $data['id'] ??
            $_GET['id'] ??
            ($_SERVER['HTTP_X_COHORT_ID'] ?? null);

        if (!$id) {
            throw new Exception("Cohort ID required");
        }

        /* DELETE ENROLLMENTS FIRST */

        db()->delete(
            "cohort_enrollments",
            "cohort_id = ?",
            [$id]
        );

        /* DELETE COHORT */

        db()->delete(
            "cohorts",
            "id = ?",
            [$id]
        );

        echo json_encode([
            "success" => true,
            "message" => "Cohort deleted successfully"
        ]);

        exit;
    }

    /* ================= INVALID REQUEST ================= */

    throw new Exception("Invalid request");

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}