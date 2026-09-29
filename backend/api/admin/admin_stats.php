<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

// CORS headers
if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "http://localhost:5173";
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id");
    header("Content-Type: application/json; charset=UTF-8");
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

try {

    /* ================= AUTH CHECK ================= */

    $clerkId = AdminAuth::checkAdminAccess();

    /* ================= DB ================= */

    $db = db();
    $conn = $db->getConnection();

    $days = isset($_GET['days']) ? (int)$_GET['days'] : 30;

    /* ================= TABLE CHECK ================= */

    $tables = [];
    $result = $conn->query("SHOW TABLES");

    if ($result instanceof mysqli_result) {
        while ($row = $result->fetch_row()) {
            $tables[$row[0]] = true;
        }
        $result->free();
    }

    $hasUsers = isset($tables['users']);
    $hasCourses = isset($tables['courses']);
    $hasEnrollments = isset($tables['enrollments']);
    $hasCertificates = isset($tables['certificates']);
    $hasPayments = isset($tables['payments']);
    $hasCohorts = isset($tables['cohorts']);

    /* ================= BASIC STATS ================= */

    $users = $hasUsers ? (int)($db->fetchOne("SELECT COUNT(*) as total FROM users")['total'] ?? 0) : 0;

    $courses = $hasCourses ? (int)($db->fetchOne("SELECT COUNT(*) as total FROM courses")['total'] ?? 0) : 0;

    $certificates = $hasCertificates ? (int)($db->fetchOne("SELECT COUNT(*) as total FROM certificates")['total'] ?? 0) : 0;

    /* ================= ENROLLMENT DATE COLUMN ================= */

    $enrollmentDateColumn = "created_at";

    if ($hasEnrollments) {

        $columns = $db->getTableColumns('enrollments');

        if (in_array('enrolled_at', $columns)) {
            $enrollmentDateColumn = "enrolled_at";
        }

    }

    $totalEnrollments = 0;
    $todayEnrollments = 0;
    $activeStudents = 0;
    $pendingCertificates = 0;

    if ($hasEnrollments) {

        $totalEnrollments = (int)($db->fetchOne(
            "SELECT COUNT(*) as total FROM enrollments"
        )['total'] ?? 0);

        $todayEnrollments = (int)($db->fetchOne(
            "SELECT COUNT(*) as total 
             FROM enrollments 
             WHERE DATE($enrollmentDateColumn) = CURDATE()"
        )['total'] ?? 0);

        $activeStudents = (int)($db->fetchOne(
            "SELECT COUNT(DISTINCT user_id) as total FROM enrollments"
        )['total'] ?? 0);

    }

    if ($hasCertificates) {

        $certColumns = $db->getTableColumns('certificates');

        if (in_array('status', $certColumns)) {

            $pendingCertificates = (int)($db->fetchOne(
                "SELECT COUNT(*) as total 
                 FROM certificates 
                 WHERE status = 'pending'"
            )['total'] ?? 0);

        }

    }

    /* ================= ROLE DISTRIBUTION ================= */

    $roleStats = [];

    if ($hasUsers) {

        $roleStats = $db->fetchAll(
            "SELECT role, COUNT(*) as total 
             FROM users 
             GROUP BY role"
        );

    }

    /* ================= SAFE REVENUE ================= */

    $revenue = 0;

    if ($hasPayments) {

        $paymentColumns = $db->getTableColumns('payments');

        if (in_array('status', $paymentColumns)) {

            $revenue = (float)($db->fetchOne("
                SELECT COALESCE(SUM(amount),0) as total
                FROM payments
                WHERE status='completed' OR status='success'
            ")['total'] ?? 0);

        } else {

            $revenue = (float)($db->fetchOne("
                SELECT COALESCE(SUM(amount),0) as total
                FROM payments
            ")['total'] ?? 0);

        }

    } elseif ($hasEnrollments && $hasCourses) {

        $revenue = (float)($db->fetchOne("
            SELECT COALESCE(SUM(c.price),0) as total
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
        ")['total'] ?? 0);

    }

    /* ================= MONTHLY ENROLLMENTS ================= */

    $monthlyEnrollments = [];

    if ($hasEnrollments) {

        $monthlyEnrollments = $db->fetchAll("
            SELECT
                DATE_FORMAT($enrollmentDateColumn,'%Y-%m') as month,
                COUNT(*) as total
            FROM enrollments
            WHERE $enrollmentDateColumn >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC
        ");

    }

    /* ================= USER GROWTH ================= */

    $userGrowth = [];

    if ($hasUsers) {

        $userGrowth = $db->fetchAll("
            SELECT
                DATE(created_at) as date,
                COUNT(*) as count
            FROM users
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL $days DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ");

    }

    /* ================= POPULAR COURSES ================= */

    $popularCourses = [];

    if ($hasEnrollments && $hasCourses) {

        $popularCourses = $db->fetchAll("
            SELECT
                c.title,
                COUNT(e.id) as enrollment_count
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            GROUP BY c.id
            ORDER BY enrollment_count DESC
            LIMIT 5
        ");

    }

    /* ================= RESPONSE ================= */

    echo json_encode([
        "success" => true,
        "stats" => [
            "users" => $users,
            "courses" => $courses,
            "enrollments" => $totalEnrollments,
            "certificates" => $certificates,
            "pending_certificates" => $pendingCertificates,
            "active_students" => $activeStudents,
            "today_enrollments" => $todayEnrollments,
            "revenue" => $revenue
        ],
        "monthly_enrollments" => $monthlyEnrollments,
        "user_growth" => $userGrowth,
        "popular_courses" => $popularCourses,
        "role_distribution" => $roleStats,
        "timestamp" => date("Y-m-d H:i:s")
    ]);

} catch (Exception $e) {

    error_log("STATS ERROR: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);

}
?>