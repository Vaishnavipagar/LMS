<?php
require_once __DIR__ . "/../core/db.php";

header("Content-Type: application/json; charset=UTF-8");

try {

    $db = db();

    /* ===== USERS ===== */
    $users = $db->fetchOne("SELECT COUNT(*) as total FROM users");
    $totalUsers = $users['total'] ?? 0;

    /* ===== COURSES ===== */
    $courses = $db->fetchOne("SELECT COUNT(*) as total FROM courses");
    $totalCourses = $courses['total'] ?? 0;

    /* ===== ENROLLMENTS ===== */
    $enrollments = $db->fetchOne("SELECT COUNT(*) as total FROM enrollments");
    $totalEnrollments = $enrollments['total'] ?? 0;

    /* ===== REVENUE ===== */
    $revenue = $db->fetchOne("
        SELECT COALESCE(SUM(amount),0) as total
        FROM payments
        WHERE status = 'success'
    ");

    $totalRevenue = $revenue['total'] ?? 0;

    /* ===== ACTIVE COHORTS ===== */

    $cohorts = $db->fetchOne("
        SELECT COUNT(*) as total
        FROM cohorts
        WHERE status = 'active'
    ");

    $activeCohorts = $cohorts['total'] ?? 0;

    echo json_encode([
        "success" => true,
        "data" => [
            "totalUsers" => (int)$totalUsers,
            "totalCourses" => (int)$totalCourses,
            "totalEnrollments" => (int)$totalEnrollments,
            "totalRevenue" => (float)$totalRevenue,
            "activeCohorts" => (int)$activeCohorts
        ]
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);

}
?>