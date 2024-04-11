<?php

$host = "localhost:3306";
$dbName = "programacionweb";
$user = "root";
$password = "masterkey192031";
$protocol = "mysql:host={$host};dbname={$dbName}";
try {
  // Generación de la Conexion a la base de datos
  $conn = new PDO($protocol, $user, $password);
} catch (PDOException $e) {
  die($e->getMessage());
}
 