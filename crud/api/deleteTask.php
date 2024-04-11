<?php
include "./partials/Connection.php";

$idTask = $_GET['id'];

try {
    $sql = "DELETE FROM `task` WHERE id={$idTask};";
    $state = $conn->query($sql);
    echo $idTask;
} catch (PDOException $e) {
    die($e->getMessage());
}