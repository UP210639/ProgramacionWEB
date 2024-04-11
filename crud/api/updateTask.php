<?php
include "./partials/Connection.php";

$userId = $_POST['users'];
$taskTitle = $_POST['title'];
$completed = $_POST['completed'];
$taskId = $_GET['id'];

try {
    $sql = "UPDATE task SET title=?, idUser=?, completed=? WHERE id={$taskId}";
    $state = $conn->prepare($sql);
    $state->execute([$taskTitle, $userId, $completed]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    die($e->getMessage());
}