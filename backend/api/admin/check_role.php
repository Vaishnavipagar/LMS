<?php
require_once __DIR__ . "/../core/db.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {

    $input = json_decode(file_get_contents("php://input"), true);

    $email = $_GET['email'] 
        ?? $input['email'] 
        ?? '';

    $clerk_id = $_GET['clerk_id'] 
        ?? $input['clerk_id'] 
        ?? ($_SERVER['HTTP_X_CLERK_ID'] ?? '');

    $email = trim($email);
    $clerk_id = trim($clerk_id);

    if (!$email && !$clerk_id) {
        throw new Exception("Email or clerk_id parameter is required");
    }

    if ($clerk_id) {
        $user = db()->fetchOne("SELECT * FROM users WHERE clerk_id = ?", [$clerk_id]);
    } else {
        $user = db()->fetchOne("SELECT * FROM users WHERE email = ?", [$email]);
    }

    if (!$user) {
        echo json_encode([
            "success" => false,
            "role" => "student",
            "isAdmin" => false,
            "message" => "User not found in database"
        ]);
        exit;
    }

    $role = trim($user['role'] ?? 'student');

    echo json_encode([
        "success" => true,
        "role" => $role,
        "isAdmin" => ($role === 'admin'),
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "clerk_id" => $user['clerk_id']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "role" => "student",
        "isAdmin" => false,
        "error" => true
    ]);
}
?>