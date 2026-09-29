<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

/* ================= HEADERS ================= */

if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? "http://localhost:5173";
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id");
    header("Content-Type: application/json; charset=UTF-8");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

/* ================= AUTH ================= */

$clerkId = AdminAuth::getClerkId();
AdminAuth::checkAdminAccess();

/* ================= INPUT ================= */

$action = $_GET['action'] ?? 'list';
$input = json_decode(file_get_contents("php://input"), true);

/* ================= HELPERS ================= */

function clean($value){
    return trim(htmlspecialchars($value));
}

function validStatus($status){
    return in_array($status, ["active","draft"]) ? $status : "draft";
}

try {

switch ($action) {

/* =====================================================
   LIST COURSES
===================================================== */

case 'list':

$courses = db()->fetchAll("
    SELECT id,title,description,thumbnail,price,status,level,created_at
    FROM courses
    ORDER BY created_at DESC
");

echo json_encode([
    "success" => true,
    "count" => count($courses),
    "data" => $courses
]);

break;


/* =====================================================
   ADD COURSE
===================================================== */

case 'add':

$title = clean($_POST['title'] ?? '');
$description = clean($_POST['description'] ?? '');
$price = floatval($_POST['price'] ?? 0);
$status = validStatus($_POST['status'] ?? 'draft');
$level = clean($_POST['level'] ?? '');
$thumbnail = clean($_POST['thumbnail'] ?? '');

if (!$title) {
    throw new Exception("Course title is required");
}

if ($price < 0) {
    throw new Exception("Invalid price");
}

$courseId = db()->insert("courses",[
    "title"=>$title,
    "description"=>$description,
    "thumbnail"=>$thumbnail,
    "price"=>$price,
    "status"=>$status,
    "level"=>$level
]);

echo json_encode([
    "success"=>true,
    "message"=>"Course created successfully",
    "course_id"=>$courseId
]);

break;


/* =====================================================
   UPDATE COURSE
===================================================== */

case 'update':

$id = intval($input['id'] ?? 0);

if(!$id){
    throw new Exception("Invalid course ID");
}

$course = db()->fetchOne(
    "SELECT * FROM courses WHERE id=?",
    [$id]
);

if(!$course){
    throw new Exception("Course not found");
}

$title = clean($input['title'] ?? $course['title']);
$description = clean($input['description'] ?? $course['description']);
$price = isset($input['price']) ? floatval($input['price']) : $course['price'];
$status = validStatus($input['status'] ?? $course['status']);
$level = clean($input['level'] ?? $course['level']);
$thumbnail = clean($input['thumbnail'] ?? $course['thumbnail']);

db()->update(
    "courses",
    [
        "title"=>$title,
        "description"=>$description,
        "thumbnail"=>$thumbnail,
        "price"=>$price,
        "status"=>$status,
        "level"=>$level
    ],
    "id=?",
    [$id]
);

echo json_encode([
    "success"=>true,
    "message"=>"Course updated successfully"
]);

break;


/* =====================================================
   DELETE COURSE
===================================================== */

case 'delete':

$id = intval($_GET['id'] ?? 0);

if(!$id){
    throw new Exception("Invalid course ID");
}

$course = db()->fetchOne(
    "SELECT id,title FROM courses WHERE id=?",
    [$id]
);

if(!$course){
    throw new Exception("Course not found");
}

/* optional safety check */
$hasEnrollments = db()->tableExists("enrollments");

if($hasEnrollments){

$enrollCount = db()->fetchOne(
    "SELECT COUNT(*) as total FROM enrollments WHERE course_id=?",
    [$id]
);

if(($enrollCount['total'] ?? 0) > 0){
    throw new Exception("Cannot delete course with enrolled students");
}

}

db()->delete("courses","id=?",[$id]);

echo json_encode([
    "success"=>true,
    "message"=>"Course deleted successfully"
]);

break;


/* ===================================================== */

default:
throw new Exception("Invalid action");

}

}catch(Exception $e){

http_response_code(400);

echo json_encode([
    "success"=>false,
    "message"=>$e->getMessage()
]);

}