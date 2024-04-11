<?php
include "./partials/Connection.php";

$idTask = $_GET['id'];

try {
    $sql = "SELECT t.*,u.firstname FROM `task` t INNER JOIN `user` u ON u.id=t.idUser WHERE t.id = {$idTask};";
    $state = $conn->query($sql);
    $row = $state->fetch();
    $json = [
        'id' => $row['id'],
        'idUser' => $row['idUser'],
        'title' => $row['title'],
        'completed' => $row['completed'] == 1,
        'firstname' => $row['firstname'],
    ];

    $jsonString = json_encode($json);
    echo $jsonString;
} catch (PDOException $e) {
    die($e->getMessage());
}