<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "http://localhost:5173";
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id");
    header("Content-Type: application/json; charset=UTF-8");
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

$clerkId = AdminAuth::getClerkId();

if (!AdminAuth::verifyAdmin($clerkId)) {
    echo json_encode(["success" => false, "message" => "Admin access required"]);
    exit;
}

$action = $_GET['action'] ?? 'list';
$input = json_decode(file_get_contents('php://input'), true);

try {

    switch ($action) {

        /* =========================
           LIST ENROLLMENTS
        ========================== */
        case 'list':

            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = max(1, intval($_GET['limit'] ?? 10));
            $search = trim($_GET['search'] ?? "");
            $status = trim($_GET['status'] ?? "");

            $offset = ($page - 1) * $limit;

            $where = "WHERE 1=1";
            $params = [];

            if ($search) {
                $where .= " AND (u.name LIKE ? OR u.email LIKE ? OR c.title LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }

            if ($status) {
                $where .= " AND e.status = ?";
                $params[] = $status;
            }

            $total = db()->fetchOne("
                SELECT COUNT(*) as total
                FROM enrollments e
                JOIN users u ON e.clerk_id = u.clerk_id
                JOIN courses c ON e.course_id = c.id
                $where
            ", $params)['total'] ?? 0;

            $enrollments = db()->fetchAll("
                SELECT
                    e.id,
                    e.clerk_id,
                    e.course_id,
                    e.progress,
                    e.status,
                    e.enrolled_at,
                    e.created_at,
                    u.name as student_name,
                    u.email as student_email,
                    c.title as course_title,
                    c.price as course_price
                FROM enrollments e
                JOIN users u ON e.clerk_id = u.clerk_id
                JOIN courses c ON e.course_id = c.id
                $where
                ORDER BY e.enrolled_at DESC
                LIMIT ? OFFSET ?
            ", array_merge($params, [$limit, $offset]));

            echo json_encode([
                "success" => true,
                "data" => $enrollments,
                "pagination" => [
                    "page" => $page,
                    "limit" => $limit,
                    "total" => $total,
                    "pages" => ceil($total / $limit)
                ]
            ]);
            break;


        /* =========================
           UPDATE ENROLLMENT
        ========================== */
        case 'update':

            $id = intval($input['id'] ?? 0);

            if (!$id) {
                throw new Exception("Enrollment ID required");
            }

            $updateData = [];

            if (isset($input['progress'])) {

                $progress = intval($input['progress']);

                $progress = max(0, min(100, $progress));

                $updateData['progress'] = $progress;
            }

            if (!empty($input['status'])) {
                $updateData['status'] = $input['status'];
            }

            if (empty($updateData)) {
                throw new Exception("No data to update");
            }

            db()->update("enrollments", $updateData, "id = ?", [$id]);


            /* AUTO CERTIFICATE */
            if (isset($updateData['progress']) && $updateData['progress'] == 100) {

                $enrollment = db()->fetchOne("
                    SELECT e.*, u.id as user_id
                    FROM enrollments e
                    JOIN users u ON e.clerk_id = u.clerk_id
                    WHERE e.id = ?
                ", [$id]);

                if ($enrollment && db()->tableExists('certificates')) {

                    $certificate = db()->fetchOne("
                        SELECT id FROM certificates
                        WHERE student_id = ? AND course_id = ?
                    ", [$enrollment['user_id'], $enrollment['course_id']]);

                    if (!$certificate) {

                        db()->insert("certificates", [
                            "student_id" => $enrollment['user_id'],
                            "course_id" => $enrollment['course_id'],
                            "status" => "pending",
                            "certificate_number" => "CERT-" . date("Ymd") . "-" . rand(1000,9999),
                            "created_at" => date("Y-m-d H:i:s")
                        ]);
                    }
                }
            }

            echo json_encode([
                "success" => true,
                "message" => "Enrollment updated successfully"
            ]);

            break;


        /* =========================
           DELETE ENROLLMENT
        ========================== */
        case 'delete':

            $id = intval($_GET['id'] ?? 0);

            if (!$id) {
                throw new Exception("Invalid ID");
            }

            db()->delete("enrollments", "id = ?", [$id]);

            echo json_encode([
                "success" => true,
                "message" => "Enrollment deleted"
            ]);

            break;


        /* =========================
           STATS
        ========================== */
        case 'stats':

            $stats = db()->fetchOne("
                SELECT
                    COUNT(*) as total_enrollments,
                    SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as active_enrollments,
                    SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed_enrollments,
                    SUM(CASE WHEN DATE(enrolled_at)=CURDATE() THEN 1 ELSE 0 END) as today_enrollments,
                    IFNULL(AVG(progress),0) as avg_progress
                FROM enrollments
            ");

            $monthly = db()->fetchAll("
                SELECT
                    DATE_FORMAT(enrolled_at,'%Y-%m') as month,
                    COUNT(*) as count
                FROM enrollments
                WHERE enrolled_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY month
                ORDER BY month DESC
            ");

            echo json_encode([
                "success" => true,
                "stats" => $stats ?: [
                    "total_enrollments" => 0,
                    "active_enrollments" => 0,
                    "completed_enrollments" => 0,
                    "today_enrollments" => 0,
                    "avg_progress" => 0
                ],
                "monthly" => $monthly ?: []
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