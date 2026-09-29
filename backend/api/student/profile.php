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

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        $input = $_GET;
    }

    $clerk_id = $input['clerk_id'] ?? "";
    $name = $input['name'] ?? "";
    $email = $input['email'] ?? "";
    $image = $input['image'] ?? "";

    if(!$clerk_id){
        throw new Exception("Missing clerk ID");
    }

    $user = db()->fetchOne(
        "SELECT * FROM users WHERE clerk_id = ?",
        [$clerk_id]
    );

    if(!$user){
        $roleId = 2; // Default student
        
        if (db()->tableExists('roles')) {
            $studentRole = db()->fetchOne("SELECT id FROM roles WHERE name = 'student'");
            if ($studentRole) {
                $roleId = $studentRole['id'];
            }
        }

        $userId = db()->insert("users", [
            "clerk_id" => $clerk_id,
            "name" => $name,
            "email" => $email,
            "image" => $image,
            "role_id" => $roleId,
            "role" => "student",
            "created_at" => date('Y-m-d H:i:s')
        ]);

        $user = db()->fetchOne(
            "SELECT * FROM users WHERE id = ?",
            [$userId]
        );
        
        if (!$user) {
            throw new Exception("Failed to create user profile");
        }
    } else {
        $updateData = [];
        if ($name && $name !== $user['name']) $updateData['name'] = $name;
        if ($email && $email !== $user['email']) $updateData['email'] = $email;
        if ($image && $image !== $user['image']) $updateData['image'] = $image;
        
        if (!empty($updateData)) {
            db()->update('users', $updateData, "clerk_id = ?", [$clerk_id]);
            $user = array_merge($user, $updateData);
        }
    }

    // Get user stats
    $stats = null;
    if (db()->tableExists('enrollments') && db()->tableExists('certificates')) {
        $stats = db()->fetchOne("
            SELECT 
                COUNT(DISTINCT e.course_id) as enrolled_courses,
                COUNT(DISTINCT c.id) as certificates_earned,
                MAX(e." . (in_array('enrolled_at', db()->getTableColumns('enrollments')) ? 'enrolled_at' : 'created_at') . ") as last_enrollment
            FROM users u
            LEFT JOIN enrollments e ON u.clerk_id = e.clerk_id
            LEFT JOIN certificates c ON u.id = c.student_id
            WHERE u.clerk_id = ?
        ", [$clerk_id]);
    }

    echo json_encode([
        "success" => true,
        "data" => $user,
        "stats" => $stats ?: ['enrolled_courses' => 0, 'certificates_earned' => 0, 'last_enrollment' => null],
        "message" => "Profile loaded successfully"
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "data" => null,
        "error" => true
    ]);
}
?>