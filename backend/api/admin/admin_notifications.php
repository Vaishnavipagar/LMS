<?php

/* ================= CORS FIX ================= */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id, X-Requested-With, Origin, Accept");
header("Content-Type: application/json");

/* ================= HANDLE PREFLIGHT ================= */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* ================= REQUIRED FILES ================= */

require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

/* ================= ADMIN AUTH ================= */

$clerkId = AdminAuth::checkAdminAccess();

/* ================= DB ================= */

$conn = get_db();

/* ================= GET NOTIFICATIONS ================= */

try {

    $query = "SELECT id,title,message,type,created_at 
              FROM notifications 
              ORDER BY created_at DESC 
              LIMIT 20";

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch notifications",
        "error" => $e->getMessage()
    ]);
}