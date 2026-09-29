<?php
require_once __DIR__ . "/../core/db.php";

if (!headers_sent()) {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, X-Clerk-Id");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Content-Type: application/json");
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

try {
    // Get Clerk ID from header or query
    $clerkId = $_SERVER["HTTP_X_CLERK_ID"] ?? $_GET["clerkId"] ?? null;

    if (!$clerkId) {
        echo json_encode([
            "success" => false,
            "message" => "Clerk ID required"
        ]);
        exit;
    }

    // Fetch user role from database
    $user = db()->fetchOne(
        "SELECT role FROM users WHERE clerk_id = ?",
        [$clerkId]
    );

    // If user not found → stop (do not auto create)
    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "User not found in database"
        ]);
        exit;
    }

    // Normalize role
    $role = strtolower(trim($user["role"] ?? "student"));

    echo json_encode([
        "success" => true,
        "role" => $role
    ]);

} catch (Exception $e) {

    // Show actual error for debugging (remove later in production)
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>