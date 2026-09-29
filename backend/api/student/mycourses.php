<?php
require_once __DIR__ . "/../core/db.php";

/* ================= HEADERS ================= */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        $input = $_GET;
    }

    $clerk_id = $input['clerk_id'] ?? "";

    if (!$clerk_id) {
        throw new Exception("Missing clerk ID");
    }

    /* ================= GET USER ================= */

    $user = db()->fetchOne(
        "SELECT * FROM users WHERE clerk_id = ?",
        [$clerk_id]
    );

    if (!$user) {
        throw new Exception("User not found");
    }

    $user_id = $user["id"];

    /* ================= CHECK TABLES ================= */

    $hasCertificates = db()->tableExists("certificates");

    /* ================= DETECT DATE COLUMN ================= */

    $dateColumn = "created_at";

    if (db()->tableExists("enrollments")) {

        $columns = db()->getTableColumns("enrollments");

        if (in_array("enrolled_at", $columns)) {
            $dateColumn = "enrolled_at";
        }

    }

    /* ================= FETCH COURSES ================= */

    $query = "
        SELECT 
            c.*,
            e.$dateColumn as enrolled_at,
            e.progress,
            e.status as enrollment_status
    ";

    if ($hasCertificates) {
        $query .= ",
            (SELECT COUNT(*) 
             FROM certificates 
             WHERE student_id = ? 
             AND course_id = c.id) as has_certificate
        ";
    } else {
        $query .= ", 0 as has_certificate";
    }

    $query .= "
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        WHERE e.user_id = ?
        ORDER BY e.$dateColumn DESC
    ";

    $params = $hasCertificates
        ? [$user_id, $user_id]
        : [$user_id];

    $data = db()->fetchAll($query, $params);

    /* ================= STATS ================= */

    $stats = db()->fetchOne(
        "
        SELECT 
            COUNT(*) as total_courses,
            AVG(progress) as avg_progress,
            SUM(CASE WHEN progress >= 100 THEN 1 ELSE 0 END) as completed_courses
        FROM enrollments
        WHERE user_id = ?
        ",
        [$user_id]
    );

    echo json_encode([
        "success" => true,
        "data" => $data,
        "stats" => $stats ?: [
            "total_courses" => 0,
            "avg_progress" => 0,
            "completed_courses" => 0
        ],
        "user" => [
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"] ?? "student"
        ],
        "count" => count($data),
        "timestamp" => date("Y-m-d H:i:s")
    ]);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "data" => [],
        "error" => true
    ]);

}
?>