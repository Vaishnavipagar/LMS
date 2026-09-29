<?php

require_once __DIR__ . "/api/core/db.php"; // ✅ correct path

try {
    $db = db()->getConnection();
    echo "✅ Database connected successfully!";
} catch (Exception $e) {
    echo "❌ Connection failed: " . $e->getMessage();
}
