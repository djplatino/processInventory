<?php
$host = "localhost:3307";
$user = "root";
$password = "";
$database = "process_inventory";
$mysql = mysqli_connect($host, $user, $password, $database);
if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

?>
