<?php
require_once __DIR__ . "/../core/db.php";

$IS_INCLUDED = (basename(__FILE__) !== basename($_SERVER["SCRIPT_FILENAME"]));

/* ================= CORS WHEN DIRECTLY ACCESSED ================= */

if (!$IS_INCLUDED) {

    $origin = $_SERVER['HTTP_ORIGIN'] ?? "http://localhost:5173";

    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit;
    }
}

class AdminAuth {

    /* =====================================================
       GET USER ROLE
    ===================================================== */

    public static function getUserRole($clerkId) {

        if (empty($clerkId)) {
            return null;
        }

        try {

            /* FIXED: use fetchOne() because Database class doesn't have fetch() */

            $user = db()->fetchOne(
                "SELECT role FROM users WHERE clerk_id = ?",
                [$clerkId]
            );

            if (!$user) {
                return null;
            }

            return strtolower(trim($user['role']));

        } catch (Exception $e) {

            error_log("AdminAuth getUserRole error: " . $e->getMessage());
            return null;

        }
    }

    /* =====================================================
       ROLE VERIFICATION
    ===================================================== */

    public static function verifyAdmin($clerkId) {
        return self::getUserRole($clerkId) === "admin";
    }

    public static function verifyTeacher($clerkId) {
        return self::getUserRole($clerkId) === "teacher";
    }

    public static function verifyStudent($clerkId) {
        return self::getUserRole($clerkId) === "student";
    }

    /* =====================================================
       GET CLERK ID FROM REQUEST
    ===================================================== */

    public static function getClerkId() {

        if (!empty($_GET['clerk_id'])) {
            return trim($_GET['clerk_id']);
        }

        if (!empty($_SERVER['HTTP_X_CLERK_ID'])) {
            return trim($_SERVER['HTTP_X_CLERK_ID']);
        }

        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {

            $auth = trim($_SERVER['HTTP_AUTHORIZATION']);
            $auth = str_replace("Bearer ", "", $auth);

            return $auth;
        }

        if (function_exists('getallheaders')) {

            $headers = getallheaders();

            foreach ($headers as $key => $value) {

                $key = strtolower($key);

                if ($key === 'x-clerk-id') {
                    return trim($value);
                }

                if ($key === 'authorization') {
                    $value = str_replace("Bearer ", "", $value);
                    return trim($value);
                }

            }

        }

        return null;
    }

    /* =====================================================
       ACCESS CHECKS
    ===================================================== */

    public static function checkAdminAccess() {

        $clerkId = self::getClerkId();

        if (!$clerkId || !self::verifyAdmin($clerkId)) {

            http_response_code(403);

            echo json_encode([
                "success" => false,
                "message" => "Admin access required",
                "debug_clerk_id" => $clerkId
            ]);

            exit;
        }

        return $clerkId;
    }

    public static function checkTeacherAccess() {

        $clerkId = self::getClerkId();

        if (!$clerkId || !self::verifyTeacher($clerkId)) {

            http_response_code(403);

            echo json_encode([
                "success" => false,
                "message" => "Teacher access required"
            ]);

            exit;
        }

        return $clerkId;
    }

    public static function checkStudentAccess() {

        $clerkId = self::getClerkId();

        if (!$clerkId || !self::verifyStudent($clerkId)) {

            http_response_code(403);

            echo json_encode([
                "success" => false,
                "message" => "Student access required"
            ]);

            exit;
        }

        return $clerkId;
    }
}

/* =====================================================
   DIRECT ACCESS TEST (DEBUG MODE)
===================================================== */

if (!$IS_INCLUDED) {

    try {

        $clerkId = AdminAuth::getClerkId();
        $role = AdminAuth::getUserRole($clerkId);

        echo json_encode([
            "success" => true,
            "clerkId" => $clerkId,
            "role" => $role ?? "none",
            "isAdmin" => $role === "admin"
        ]);

    } catch (Exception $e) {

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);

    }

}
?>