<?php
// ========================================
//  backend/api/test.php
//  Simple DB connection test file
// ========================================

// 1. Load core files
require_once __DIR__ . "/core/config.php";
require_once __DIR__ . "/core/db.php";

// 2. Headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {

    // 3. Get database instance (your singleton)
    $database = db();

    // 4. Check connection
    $conn = $database->getConnection();

    // 5. Test query
    $result = $database->fetchOne("SELECT DATABASE() as db");

    echo json_encode([
        "success" => true,
        "message" => "Database Class Working Perfectly",
        "connected_database" => $result["db"],
        "time" => date("Y-m-d H:i:s")
    ]);

} catch (Throwable $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>