<?php

require_once __DIR__ . "/../core/db.php";

/* ================= HEADERS ================= */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* ================= API ================= */

try {

    $category = $_GET['category'] ?? '';
    $search   = $_GET['search'] ?? '';
    $limit    = isset($_GET['limit']) ? intval($_GET['limit']) : 0;

    /* ================= QUERY ================= */

    $sql = "
        SELECT 
            id,
            title,
            description,
            thumbnail,
            price,
            level,
            duration,
            created_at
        FROM courses
        WHERE status = 'active'
    ";

    $params = [];

    /* CATEGORY FILTER */

    if (!empty($category)) {
        $sql .= " AND category = ?";
        $params[] = $category;
    }

    /* SEARCH FILTER */

    if (!empty($search)) {
        $sql .= " AND (title LIKE ? OR description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    /* ORDER */

    $sql .= " ORDER BY created_at DESC";

    /* LIMIT */

    if ($limit > 0) {
        $sql .= " LIMIT ?";
        $params[] = $limit;
    }

    /* FETCH DATA */

    $courses = db()->fetchAll($sql, $params);

    echo json_encode([
        "success"   => true,
        "data"      => $courses,
        "total"     => count($courses),
        "count"     => count($courses),
        "timestamp" => date("Y-m-d H:i:s")
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to load courses",
        "error"   => $e->getMessage(),
        "data"    => [],
        "timestamp" => date("Y-m-d H:i:s")
    ]);

}