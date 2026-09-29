<?php
require_once __DIR__ . "/../core/db.php";
require_once __DIR__ . "/admin_auth.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Clerk-Id");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

AdminAuth::checkAdminAccess();

$action = $_GET["action"] ?? "";
$input = json_decode(file_get_contents("php://input"), true);

try {
    // Create tables if they don't exist
    if (!db()->tableExists('course_modules')) {
        db()->executeQuery("
            CREATE TABLE IF NOT EXISTS course_modules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                position INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }

    if (!db()->tableExists('course_lessons')) {
        db()->executeQuery("
            CREATE TABLE IF NOT EXISTS course_lessons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                module_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(50) DEFAULT 'video',
                content TEXT,
                video_url VARCHAR(500),
                video_path VARCHAR(500),
                video_size INT,
                duration VARCHAR(50),
                position INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }

    switch($action){
        case "course":
            $courseId = intval($_GET["course_id"] ?? 0);
            $modules = db()->fetchAll("
                SELECT * FROM course_modules
                WHERE course_id=?
                ORDER BY position ASC
            ", [$courseId]);

            foreach($modules as &$m){
                $m["lessons"] = db()->fetchAll("
                    SELECT * FROM course_lessons
                    WHERE module_id=?
                    ORDER BY position ASC
                ", [$m["id"]]);
            }

            echo json_encode(["success"=>true,"data"=>$modules]);
            break;

        case "add_module":
            $id = db()->insert("course_modules", [
                "course_id"=>$input["course_id"],
                "title"=>$input["title"],
                "position"=>$input["position"] ?? 0
            ]);
            echo json_encode(["success"=>true,"module_id"=>$id]);
            break;

        case "add_lesson":
            $id = db()->insert("course_lessons", [
                "module_id"=>$input["module_id"],
                "title"=>$input["title"],
                "type"=>$input["type"] ?? "video",
                "content"=>$input["content"] ?? "",
                "video_url"=>$input["video_url"] ?? "",
                "duration"=>$input["duration"] ?? "",
                "position"=>$input["position"] ?? 0
            ]);
            echo json_encode(["success"=>true,"lesson_id"=>$id]);
            break;

        case "upload_video":
            $lessonId = intval($_POST["lesson_id"] ?? 0);
            if (!$lessonId) throw new Exception("Lesson ID required");

            if (empty($_FILES["video"]["name"])) {
                throw new Exception("No video uploaded");
            }

            $dir = __DIR__."/../../uploads/videos/";
            if (!file_exists($dir)) mkdir($dir,0777,true);

            $filename = time()."_".$_FILES["video"]["name"];
            $path = $dir.$filename;

            move_uploaded_file($_FILES["video"]["tmp_name"], $path);

            $publicPath = "/linux/backend/uploads/videos/".$filename;

            db()->update("course_lessons", [
                "video_path"=>$publicPath,
                "video_size"=>$_FILES["video"]["size"]
            ], "id=?", [$lessonId]);

            echo json_encode([
                "success"=>true,
                "video"=>$publicPath
            ]);
            break;

        case "delete_module":
            db()->delete("course_modules", "id=?", [$_GET["id"]]);
            echo json_encode(["success"=>true]);
            break;

        case "delete_lesson":
            db()->delete("course_lessons", "id=?", [$_GET["id"]]);
            echo json_encode(["success"=>true]);
            break;

        default:
            throw new Exception("Invalid action");
    }

} catch(Exception $e){
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}
?>