<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Configuración de conexión a la base de datos
$servername = "localhost";
$username = "root"; // Cambia si tienes otro usuario
$password = ""; // Cambia si tienes una contraseña
$dbname = "Score";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Leer los datos enviados en JSON
$data = json_decode(file_get_contents("php://input"));

if (isset($data->tiempo) && isset($data->puntos) && isset($data->nombre)) {
    $tiempo = $data->tiempo;
    $puntos = $data->puntos;
    $fecha = date("Y-m-d H:i:s");
    $nombre = $data->nombre;

    $stmt = $conn->prepare("INSERT INTO score (tiempo, puntos, fecha, nombre) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiss", $tiempo, $puntos, $fecha, $nombre);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Puntaje guardado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al guardar el puntaje"]);
    }

    $stmt->close();
} else {
    echo json_encode(["message" => "Datos incompletos"]);
}

$conn->close();
?>
