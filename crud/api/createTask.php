<?php
include "./partials/Connection.php";

$userId = $_POST['users'];
$taskTitle = $_POST['title'];
$completed = $_POST['completed'];

try {
    $sql = "INSERT INTO task (title, idUser, completed) VALUES (?, ?, ?)";
    $state = $conn->prepare($sql);
    $state->execute([$taskTitle, $userId, $completed]);
    $lastInsertId = $conn->lastInsertId();

    echo json_encode(["success" => true, "taskId" => $lastInsertId]);
} catch (PDOException $e) {
    die($e->getMessage());
}