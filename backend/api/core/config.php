<?php
session_start();

// ================= DATABASE =================
define("DB_HOST", "127.0.0.1");  // safer than localhost
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "linux_lms");
define("DB_PORT", 3306); // ✅ MUST MATCH YOUR MYSQL PORT

// ================= SECURITY =================
define("JWT_SECRET", "your-secret-key-change-in-production");
define("API_KEY", "your-api-key-change-in-production");

// ================= SYSTEM =================
date_default_timezone_set('Asia/Kolkata');

// ================= DEV MODE =================
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ================= API URLs =================
define("API_BASE_URL", "http://localhost/linux/backend/api");
define("FRONTEND_URL", "http://localhost:5173");

// ================= CORS =================
header("Access-Control-Allow-Origin: " . FRONTEND_URL);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
?>