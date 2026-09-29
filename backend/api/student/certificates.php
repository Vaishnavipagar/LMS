<?php
require_once __DIR__ . "/../core/db.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {

    $method = $_SERVER['REQUEST_METHOD'];

    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        $input = $_GET;
    }

    /* ================= CLERK ID ================= */

    $clerk_id = $_SERVER['HTTP_X_CLERK_ID'] ?? ($input['clerk_id'] ?? '');

    if (!$clerk_id) {
        echo json_encode([
            "success" => false,
            "message" => "Missing clerk_id",
            "error" => true
        ]);
        exit;
    }

    /* ================= GET USER ================= */

    $user = db()->fetchOne(
        "SELECT id FROM users WHERE clerk_id = ?",
        [$clerk_id]
    );

    if (!$user) {
        throw new Exception("User not found");
    }

    $user_id = $user["id"];

    /* ================= GET CERTIFICATES ================= */

    if ($method === 'GET') {

        $data = db()->fetchAll("
            SELECT
                cr.id,
                cr.title,
                e.progress,

                c.status,
                c.certificate_number AS credentialId,
                c.issued_at AS issueDate

            FROM enrollments e

            JOIN courses cr 
                ON cr.id = e.course_id

            LEFT JOIN certificates c 
                ON c.course_id = e.course_id 
                AND c.student_id = e.user_id

            WHERE e.user_id = ?

            ORDER BY e.created_at DESC
        ", [$user_id]);

        /* FORMAT STATUS FOR UI */

        foreach ($data as &$row) {

            if ($row["progress"] >= 100 && $row["status"] === "approved") {
                $row["status"] = "completed";
            } 
            elseif ($row["progress"] >= 100) {
                $row["status"] = "earned";
            } 
            else {
                $row["status"] = "in-progress";
            }

            $row["grade"] = $row["progress"] >= 100 ? "A" : null;
        }

        echo json_encode([
            "success" => true,
            "data" => $data,
            "count" => count($data)
        ]);

        exit;
    }

    /* ================= CREATE CERTIFICATE ================= */

    if ($method === 'POST') {

        $course_id = $input['course_id'] ?? "";

        if (!$course_id) {
            throw new Exception("course_id is required");
        }

        /* CHECK EXISTING */

        $existing = db()->fetchOne("
            SELECT id FROM certificates
            WHERE student_id = ? AND course_id = ?
        ", [$user_id, $course_id]);

        if ($existing) {
            throw new Exception("Certificate already exists");
        }

        /* CHECK PROGRESS */

        $enrollment = db()->fetchOne("
            SELECT progress FROM enrollments
            WHERE user_id = ? AND course_id = ?
        ", [$user_id, $course_id]);

        if (!$enrollment || $enrollment["progress"] < 100) {
            throw new Exception("Course not completed yet");
        }

        /* CREATE CERTIFICATE */

        $certificate_number =
            "CERT-" . date("Y") . "-" . str_pad(rand(1,9999),4,"0",STR_PAD_LEFT);

        $certificateId = db()->insert("certificates", [
            "student_id" => $user_id,
            "course_id" => $course_id,
            "status" => "pending",
            "certificate_number" => $certificate_number,
            "created_at" => date("Y-m-d H:i:s")
        ]);

        echo json_encode([
            "success" => true,
            "certificate_id" => $certificateId,
            "certificate_number" => $certificate_number,
            "status" => "pending",
            "message" => "Certificate request submitted"
        ]);

        exit;
    }

    throw new Exception("Method not allowed");

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "error" => true
    ]);
}