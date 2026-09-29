<?php
require_once __DIR__ . "/../core/db.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$method = $_SERVER["REQUEST_METHOD"];

$raw = file_get_contents("php://input");
$d = json_decode($raw);

if (!$d) {
    $d = new stdClass();
}

$clerk = $d->clerk_id ?? ($_GET['clerk_id'] ?? "");

if (!$clerk) {
  http_response_code(400);
  echo json_encode(["status" => "error", "message" => "Missing clerk ID"]);
  exit;
}

// Check if settings table exists
if (!db()->tableExists('settings')) {
    // Create settings table
    db()->executeQuery("
        CREATE TABLE IF NOT EXISTS settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            clerk_id VARCHAR(255) UNIQUE,
            darkMode BOOLEAN DEFAULT 0,
            notifications BOOLEAN DEFAULT 1,
            emailAlerts BOOLEAN DEFAULT 1,
            soundEffects BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
}

if ($method == "POST") {
    $s = db()->fetchOne(
        "SELECT * FROM settings WHERE clerk_id=?",
        [$clerk]
    );

    echo json_encode([
        "success" => true,
        "data" => $s ?: []
    ]);
    exit;
}

if ($method == "PUT") {
    $s = $d->settings ?? new stdClass();

    db()->executeQuery("
        INSERT INTO settings
        (clerk_id, darkMode, notifications, emailAlerts, soundEffects)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        darkMode = VALUES(darkMode),
        notifications = VALUES(notifications),
        emailAlerts = VALUES(emailAlerts),
        soundEffects = VALUES(soundEffects)
    ", [
        $clerk,
        $s->darkMode ?? 0,
        $s->notifications ?? 1,
        $s->emailAlerts ?? 1,
        $s->soundEffects ?? 1
    ]);

    echo json_encode(['success' => true, 'status' => 'saved']);
}
?>