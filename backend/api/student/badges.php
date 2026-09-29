<?php

require_once __DIR__ . "/../core/db.php";

/* ================= CORS HEADERS ================= */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

/* ================= PREFLIGHT ================= */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {

    /* ================= GET CLERK ID ================= */

    $clerk_id = "";

    // GET request
    if (isset($_GET["clerk_id"]) && $_GET["clerk_id"] !== "") {
        $clerk_id = $_GET["clerk_id"];
    }

    // POST JSON request
    if (!$clerk_id) {
        $raw = file_get_contents("php://input");
        if ($raw) {
            $input = json_decode($raw, true);
            if (is_array($input) && isset($input["clerk_id"])) {
                $clerk_id = $input["clerk_id"];
            }
        }
    }

    if (!$clerk_id) {
        echo json_encode([]);
        exit();
    }

    /* ================= FETCH BADGES ================= */

    $badges = db()->fetchAll(
        "SELECT title, `desc`, icon, color
         FROM badges
         WHERE clerk_id = ?
         ORDER BY id DESC",
        [$clerk_id]
    );

    if (!$badges) {
        $badges = [];
    }

    /* ================= OUTPUT ================= */

    echo json_encode($badges);
    exit();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "error" => true,
        "message" => $e->getMessage()
    ]);

    exit();
}