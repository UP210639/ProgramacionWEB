<?php
include "./partials/Connection.php";

$idUser = $_GET['id'];

try {
    $sql = "SELECT t.*,u.firstname FROM `task` t INNER JOIN `user` u ON u.id=t.idUser WHERE idUser = {$idUser};";
    $state = $conn->query($sql);
    $json = [];
    while ($row = $state->fetch(PDO::FETCH_ASSOC)) {
        $json[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'completed' => $row['completed'],
            'idUser' => $row['idUser'],
            'firstname' => $row['firstname']
        ];
    };

    $jsonString = json_encode($json);
    echo $jsonString;
} catch (PDOException $e) {
    die($e->getMessage());
}