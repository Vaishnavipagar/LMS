<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

/* ================= HEADERS ================= */

if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "http://localhost:5173";
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Clerk-Id, Origin, Accept");
    header("Content-Type: application/json; charset=UTF-8");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

/* ================= AUTH ================= */

$clerkId = AdminAuth::getClerkId();
AdminAuth::checkAdminAccess();

/* ================= INPUT ================= */

$action = $_GET['action'] ?? '';

/* ======================================================
   LIST PAYMENTS
====================================================== */

if ($action === "list") {

    $page = intval($_GET['page'] ?? 1);
    $limit = intval($_GET['limit'] ?? 10);
    $offset = ($page - 1) * $limit;

    try {

        $payments = db()->fetchAll("
            SELECT 
                p.id,
                p.amount,
                p.payment_method,
                p.transaction_id,
                p.created_at,
                u.name as student_name,
                u.email as student_email,
                c.title as course_title
            FROM payments p
            JOIN users u ON p.user_id = u.id
            JOIN courses c ON p.course_id = c.id
            ORDER BY p.created_at DESC
            LIMIT $offset, $limit
        ");

        /* ---------- COUNT ---------- */

        $countRow = db()->fetchOne("SELECT COUNT(*) as total FROM payments");
        $total = $countRow['total'] ?? 0;

        /* ---------- REVENUE ---------- */

        $totalRevenueRow = db()->fetchOne("
            SELECT IFNULL(SUM(amount),0) as total
            FROM payments
            WHERE status='success'
        ");

        $monthlyRevenueRow = db()->fetchOne("
            SELECT IFNULL(SUM(amount),0) as total
            FROM payments
            WHERE status='success'
            AND MONTH(created_at)=MONTH(CURRENT_DATE())
            AND YEAR(created_at)=YEAR(CURRENT_DATE())
        ");

        $todayRevenueRow = db()->fetchOne("
            SELECT IFNULL(SUM(amount),0) as total
            FROM payments
            WHERE status='success'
            AND DATE(created_at)=CURRENT_DATE()
        ");

        echo json_encode([
            "success" => true,
            "data" => $payments,
            "revenue" => [
                "total_revenue" => (float)($totalRevenueRow['total'] ?? 0),
                "monthly_revenue" => (float)($monthlyRevenueRow['total'] ?? 0),
                "today_revenue" => (float)($todayRevenueRow['total'] ?? 0)
            ],
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total" => $total,
                "pages" => ceil($total / $limit)
            ]
        ]);

    } catch (Exception $e) {

        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);

    }

    exit;
}


/* ======================================================
   ADD PAYMENT
====================================================== */

if ($action === "add") {

    $data = json_decode(file_get_contents("php://input"), true);

    $clerk_id = $data['clerk_id'] ?? null;
    $course_id = $data['course_id'] ?? null;
    $amount = $data['amount'] ?? null;
    $payment_method = $data['payment_method'] ?? "cash";

    if (!$clerk_id || !$course_id || !$amount) {

        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);

        exit;
    }

    try {

        /* ---------- FIND USER ---------- */

        $user = db()->fetchOne(
            "SELECT id FROM users WHERE clerk_id=?",
            [$clerk_id]
        );

        if (!$user) {

            echo json_encode([
                "success" => false,
                "message" => "User not found"
            ]);

            exit;
        }

        $user_id = $user['id'];

        /* ---------- GENERATE TRANSACTION ---------- */

        $transaction_id = "TXN_" . strtoupper(uniqid());

        /* ---------- INSERT PAYMENT ---------- */

        db()->insert("payments", [
            "user_id" => $user_id,
            "course_id" => $course_id,
            "amount" => $amount,
            "status" => "success",
            "transaction_id" => $transaction_id,
            "payment_method" => $payment_method
        ]);

        /* ---------- AUTO ENROLL STUDENT ---------- */

        if (db()->tableExists("enrollments")) {

            $existing = db()->fetchOne(
                "SELECT id FROM enrollments WHERE clerk_id=? AND course_id=?",
                [$clerk_id, $course_id]
            );

            if (!$existing) {

                db()->insert("enrollments", [
                    "clerk_id" => $clerk_id,
                    "course_id" => $course_id,
                    "progress" => 0,
                    "status" => "active"
                ]);

            }

        }

        echo json_encode([
            "success" => true,
            "message" => "Payment recorded and student enrolled successfully"
        ]);

    } catch (Exception $e) {

        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);

    }

    exit;
}


/* ======================================================
   INVALID ACTION
====================================================== */

echo json_encode([
    "success" => false,
    "message" => "Invalid action"
]);