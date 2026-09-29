<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$clerkId = AdminAuth::checkAdminAccess();
$action = $_GET['action'] ?? '';

try {

    switch ($action) {

        case 'list':

            $certificates = db()->fetchAll("
                SELECT 
                    c.id,
                    c.status,
                    c.created_at,
                    c.rejection_reason,
                    u.name AS student_name,
                    u.email AS student_email,
                    cr.title AS course_title
                FROM certificates c
                LEFT JOIN users u ON c.student_id = u.id
                LEFT JOIN courses cr ON c.course_id = cr.id
                ORDER BY c.id DESC
            ");

            echo json_encode([
                "success" => true,
                "data" => $certificates,
                "count" => count($certificates)
            ]);
            break;


        case 'approve':

            $certId = intval($_GET['id'] ?? 0);

            if (!$certId) {
                throw new Exception("Invalid certificate ID");
            }

            db()->update(
                'certificates',
                [
                    'status' => 'approved',
                    'issued_at' => date('Y-m-d H:i:s')
                ],
                "id = ?",
                [$certId]
            );

            echo json_encode([
                "success" => true,
                "message" => "Certificate approved"
            ]);
            break;


        case 'reject':

            $certId = intval($_GET['id'] ?? 0);
            $reason = $_GET['reason'] ?? 'Not specified';

            if (!$certId) {
                throw new Exception("Invalid certificate ID");
            }

            db()->update(
                'certificates',
                [
                    'status' => 'rejected',
                    'rejection_reason' => $reason
                ],
                "id = ?",
                [$certId]
            );

            echo json_encode([
                "success" => true,
                "message" => "Certificate rejected"
            ]);
            break;


        default:
            throw new Exception("Invalid action");
    }

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>