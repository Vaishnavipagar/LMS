<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

/* ================= HEADERS ================= */

if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "http://localhost:5173";
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id");
    header("Content-Type: application/json; charset=UTF-8");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

/* ================= AUTH ================= */

$clerkId = AdminAuth::getClerkId();
AdminAuth::checkAdminAccess();

/* ================= INPUT ================= */

$action = $_GET['action'] ?? 'list';
$input = json_decode(file_get_contents('php://input'), true);

try {

    $hasEnrollments = db()->tableExists('enrollments');
    $hasCertificates = db()->tableExists('certificates');

    switch ($action) {

        /* ================= LIST USERS ================= */

        case 'list':

            $roleFilter = strtolower(trim($_GET['role'] ?? ''));
            $search = trim($_GET['search'] ?? '');

            if ($roleFilter === "instructor") {
                $roleFilter = "teacher";
            }

            $where = "WHERE 1=1";
            $params = [];

            /* ROLE FILTER */

            if (!empty($roleFilter) && $roleFilter !== "all") {
                $where .= " AND role = ?";
                $params[] = $roleFilter;
            }

            /* SEARCH FILTER */

            if (!empty($search)) {
                $where .= " AND (name LIKE ? OR email LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }

            $users = db()->fetchAll(
                "SELECT * FROM users $where ORDER BY id DESC",
                $params
            );

            foreach ($users as &$user) {

                /* ENROLLMENT COUNT */

                if ($hasEnrollments) {

                    $enrollments = db()->fetchOne(
                        "SELECT COUNT(*) as total FROM enrollments WHERE clerk_id=?",
                        [$user['clerk_id']]
                    );

                    $user['total_enrollments'] = $enrollments['total'] ?? 0;

                } else {

                    $user['total_enrollments'] = 0;

                }

                /* CERTIFICATE COUNT */

                if ($hasCertificates) {

                    $certificates = db()->fetchOne(
                        "SELECT COUNT(*) as total FROM certificates WHERE clerk_id=?",
                        [$user['clerk_id']]
                    );

                    $user['total_certificates'] = $certificates['total'] ?? 0;

                } else {

                    $user['total_certificates'] = 0;

                }

                $user['role_name'] = $user['role'] ?? "student";
            }

            echo json_encode([
                "success" => true,
                "data" => $users
            ]);

        break;


        /* ================= CHANGE ROLE ================= */

        case 'role':

            $userId = intval($input['id'] ?? 0);
            $newRole = strtolower(trim($input['role'] ?? ''));

            if (!$userId) throw new Exception("Invalid user ID");

            if (!in_array($newRole, ['student','teacher','admin'])) {
                throw new Exception("Invalid role");
            }

            $targetUser = db()->fetchOne(
                "SELECT * FROM users WHERE id=?",
                [$userId]
            );

            if (!$targetUser) throw new Exception("User not found");

            if ($targetUser['clerk_id'] === $clerkId) {
                throw new Exception("Cannot change your own role");
            }

            db()->update(
                "users",
                ["role"=>$newRole],
                "id=?",
                [$userId]
            );

            echo json_encode([
                "success"=>true,
                "message"=>"User role updated successfully"
            ]);

        break;


        /* ================= DELETE USER ================= */

        case 'delete':

            $userId = intval($_GET['id'] ?? 0);

            if (!$userId) throw new Exception("Invalid user ID");

            $targetUser = db()->fetchOne(
                "SELECT * FROM users WHERE id=?",
                [$userId]
            );

            if (!$targetUser) throw new Exception("User not found");

            if ($targetUser['clerk_id'] === $clerkId) {
                throw new Exception("Cannot delete your own account");
            }

            if ($targetUser['role'] === "admin") {
                throw new Exception("Cannot delete admin account");
            }

            db()->delete("users", "id=?", [$userId]);

            echo json_encode([
                "success"=>true,
                "message"=>"User deleted"
            ]);

        break;


        default:
            throw new Exception("Invalid action");

    }

} catch(Exception $e){

    http_response_code(400);

    echo json_encode([
        "success"=>false,
        "message"=>$e->getMessage()
    ]);

}
?>