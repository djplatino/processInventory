<?php

if (!is_localhost()) {

    include 'cgi-bin/config.php';
}
else {
     include 'cgi-bin/config.php';
}
include 'includes/databaseFunctions.php';

if (isset($_POST['action'])) {
  $POST = filter_var_array($_POST, FILTER_SANITIZE_STRING);
  $action = $POST['action'];
  switch($action) {
    case "getInitialData":
      echo getInitialData($mysql);
      break;
    default:
      die( '{"status":"failed","message":"The action has not been defined", "error":1002}');
      break;
  }
}
else {
  die( '{"status":"failed","message":"The action was not set", "error":1001}');
}





function is_localhost(){
    //echo "is";
  $whitelist = array( '127.0.0.1', '::1' );
  return in_array( $_SERVER['REMOTE_ADDR'], $whitelist);
}
?>
