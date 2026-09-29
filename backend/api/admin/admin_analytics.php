<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "http://localhost:5173";
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, X-Clerk-Id");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Content-Type: application/json");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {

    /* ===== AUTH CHECK ===== */
    $clerkId = AdminAuth::checkAdminAccess();

    $days = isset($_GET['days']) ? intval($_GET['days']) : 30;

    /* ===== USERS GROWTH ===== */
    $usersGrowth = [];

    if (db()->tableExists('users')) {

        $usersGrowth = db()->fetchAll("
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM users
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        ", [$days]);

    }

    /* ===== ENROLLMENT GROWTH ===== */

    $enrollmentGrowth = [];

    if (db()->tableExists('enrollments')) {

        $columns = db()->getTableColumns('enrollments');

        $dateColumn = in_array('enrolled_at', $columns) ? 'enrolled_at' : 'created_at';

        $enrollmentGrowth = db()->fetchAll("
            SELECT DATE($dateColumn) as date, COUNT(*) as count
            FROM enrollments
            WHERE $dateColumn >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE($dateColumn)
            ORDER BY DATE($dateColumn)
        ", [$days]);

    }

    /* ===== TOP COURSES ===== */

    $topCourses = [];

    if (db()->tableExists('courses') && db()->tableExists('enrollments')) {

        $topCourses = db()->fetchAll("
            SELECT c.title, COUNT(e.id) as enrollments
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            GROUP BY c.id
            ORDER BY enrollments DESC
            LIMIT 5
        ");

    }

    echo json_encode([
        "success" => true,
        "users_growth" => $usersGrowth ?: [],
        "enrollments_growth" => $enrollmentGrowth ?: [],
        "top_courses" => $topCourses ?: []
    ]);

} catch (Exception $e) {

    error_log("ANALYTICS ERROR: " . $e->getMessage());

    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);

}
?>