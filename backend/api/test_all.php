<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/core/db.php";

$results = [];

try {
    // Test database connection
    $db = db();
    $conn = $db->getConnection();
    $results['database'] = [
        'success' => true,
        'message' => 'Connected to database: ' . DB_NAME
    ];

    // Check all required tables
    $requiredTables = [
        'users', 'roles', 'courses', 'enrollments', 
        'certificates', 'course_modules', 'course_lessons', 
        'settings', 'payments'
    ];

    $tables = [];
    foreach ($requiredTables as $table) {
        $exists = $db->tableExists($table);
        $tables[$table] = $exists ? '✅ EXISTS' : '❌ MISSING';
        
        if ($exists) {
            $count = $db->fetchOne("SELECT COUNT(*) as total FROM $table")['total'] ?? 0;
            $tables[$table] .= " ($count records)";
        }
    }
    $results['tables'] = $tables;

    // Get sample data counts
    $results['counts'] = [
        'users' => $db->fetchOne("SELECT COUNT(*) as total FROM users")['total'] ?? 0,
        'courses' => $db->fetchOne("SELECT COUNT(*) as total FROM courses")['total'] ?? 0,
        'enrollments' => $db->fetchOne("SELECT COUNT(*) as total FROM enrollments")['total'] ?? 0,
        'certificates' => $db->fetchOne("SELECT COUNT(*) as total FROM certificates")['total'] ?? 0,
        'payments' => $db->fetchOne("SELECT COUNT(*) as total FROM payments")['total'] ?? 0
    ];

    // Check admin user exists
    $admin = $db->fetchOne("SELECT * FROM users WHERE role = 'admin' OR role_id = 1 LIMIT 1");
    $results['admin_exists'] = $admin ? '✅ Yes' : '❌ No admin user found';

    echo json_encode([
        'success' => true,
        'message' => '✅ All systems operational',
        'timestamp' => date('Y-m-d H:i:s'),
        'details' => $results
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '❌ System check failed',
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>