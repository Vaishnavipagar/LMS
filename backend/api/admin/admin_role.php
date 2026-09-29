<?php
require_once "../config.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json");

$headers = getallheaders();
$token = $headers["Authorization"] ?? "";

if (!$token) {
  echo json_encode([
    "success" => false,
    "message" => "No token"
  ]);
  exit;
}

// 👉 TEMP DEMO LOGIC
// Later we connect with Clerk user meta

echo json_encode([
  "success" => true,
  "role" => "admin"
]);