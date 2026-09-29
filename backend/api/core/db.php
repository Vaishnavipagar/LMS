<?php
require_once __DIR__ . "/config.php";

class Database {

    private $conn;
    private static $instance = null;

    private function __construct() {
        $this->connect();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    private function connect() {
        try {
            $this->conn = new mysqli(
                DB_HOST,
                DB_USER,
                DB_PASS,
                DB_NAME,
                DB_PORT
            );

            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }

            $this->conn->set_charset("utf8mb4");
            
        } catch (Exception $e) {
            error_log("DB Connection Error: " . $e->getMessage());
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public function getConnection() {
        if (!$this->conn || $this->conn->connect_error) {
            $this->connect();
        }
        return $this->conn;
    }

    public function executeQuery($sql, $params = []) {
        try {
            $conn = $this->getConnection();
            
            if (empty($params)) {
                $result = $conn->query($sql);
                if ($result === false) {
                    throw new Exception($conn->error);
                }
                return $result;
            }

            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                throw new Exception($conn->error);
            }

            $types = str_repeat("s", count($params));
            $stmt->bind_param($types, ...$params);

            if (!$stmt->execute()) {
                throw new Exception($stmt->error);
            }

            return $stmt;

        } catch (Exception $e) {
            error_log("SQL Error: " . $e->getMessage() . " | QUERY: " . $sql);
            throw new Exception("Database query failed: " . $e->getMessage());
        }
    }

    public function fetchAll($sql, $params = []) {
        try {
            $result = $this->executeQuery($sql, $params);
            
            if ($result instanceof mysqli_result) {
                $rows = [];
                while ($row = $result->fetch_assoc()) {
                    $rows[] = $row;
                }
                $result->free();
                return $rows;
            }
            
            if ($result instanceof mysqli_stmt) {
                $meta = $result->result_metadata();
                if (!$meta) {
                    $result->close();
                    return [];
                }
                
                $fields = [];
                $row = [];
                while ($field = $meta->fetch_field()) {
                    $fields[] = &$row[$field->name];
                }
                
                call_user_func_array([$result, 'bind_result'], $fields);
                
                $rows = [];
                while ($result->fetch()) {
                    $temp = [];
                    foreach ($row as $key => $val) {
                        $temp[$key] = $val;
                    }
                    $rows[] = $temp;
                }
                
                $result->close();
                return $rows;
            }
            
            return [];
            
        } catch (Exception $e) {
            error_log("FetchAll Error: " . $e->getMessage());
            throw $e;
        }
    }

    public function fetchOne($sql, $params = []) {
        $rows = $this->fetchAll($sql, $params);
        return !empty($rows) ? $rows[0] : null;
    }

    public function insert($table, $data) {
        try {
            $keys = array_keys($data);
            $values = array_values($data);
            $placeholders = str_repeat("?,", count($keys) - 1) . "?";
            
            $sql = "INSERT INTO $table (" . implode(",", $keys) . ") VALUES ($placeholders)";
            
            $stmt = $this->executeQuery($sql, $values);
            $insertId = $this->getConnection()->insert_id;
            
            if ($stmt instanceof mysqli_stmt) {
                $stmt->close();
            }
            
            return $insertId;
            
        } catch (Exception $e) {
            error_log("Insert Error: " . $e->getMessage());
            throw $e;
        }
    }

    public function update($table, $data, $where, $whereParams = []) {
        try {
            $sets = [];
            $values = [];
            
            foreach ($data as $key => $value) {
                $sets[] = "$key = ?";
                $values[] = $value;
            }
            
            $sql = "UPDATE $table SET " . implode(", ", $sets) . " WHERE $where";
            $values = array_merge($values, $whereParams);
            
            $stmt = $this->executeQuery($sql, $values);
            $affected = $this->getConnection()->affected_rows;
            
            if ($stmt instanceof mysqli_stmt) {
                $stmt->close();
            }
            
            return $affected;
            
        } catch (Exception $e) {
            error_log("Update Error: " . $e->getMessage());
            throw $e;
        }
    }

    public function delete($table, $where, $params = []) {
        try {
            $sql = "DELETE FROM $table WHERE $where";
            
            $stmt = $this->executeQuery($sql, $params);
            $affected = $this->getConnection()->affected_rows;
            
            if ($stmt instanceof mysqli_stmt) {
                $stmt->close();
            }
            
            return $affected;
            
        } catch (Exception $e) {
            error_log("Delete Error: " . $e->getMessage());
            throw $e;
        }
    }

    public function tableExists($table) {
        try {
            $sql = "
                SELECT COUNT(*) as count
                FROM information_schema.tables
                WHERE table_schema = ?
                AND table_name = ?
            ";

            $result = $this->fetchOne($sql, [DB_NAME, $table]);
            return ($result['count'] ?? 0) > 0;

        } catch (Exception $e) {
            return false;
        }
    }

    public function getTableColumns($table) {
        try {
            $columns = $this->fetchAll("SHOW COLUMNS FROM $table");
            return array_column($columns, 'Field');
        } catch (Exception $e) {
            return [];
        }
    }

    public function beginTransaction() {
        $this->getConnection()->begin_transaction();
    }

    public function commit() {
        $this->getConnection()->commit();
    }

    public function rollback() {
        $this->getConnection()->rollback();
    }

    public function __destruct() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}

function db() {
    return Database::getInstance();
}
?>