<?php

if (!is_localhost()) {

    include 'cgi-bin/config.php';
} else {
    include 'cgi-bin/config.php';
}
include 'includes/databaseFunctions.php';

if (isset($_POST['action'])) {
    $POST = filter_var_array($_POST, FILTER_SANITIZE_STRING);
    $action = $POST['action'];
    switch ($action) {
        case "getInitialData":
            echo getInitialData($mysql);
            break;
        case "getInventoryCounts":
            echo getInventoryCounts($mysql);
            break;
        case "addInventory":
            $currentInventory = $POST["currentInventory"];
            $customerId   = $currentInventory["customer_id"];
            $supervisorId = $currentInventory["supervisor_id"];
            $startDateTime = $currentInventory["start_date_time"];
            $endDateTime   = $currentInventory["end_date_time"];
            $comments      = $currentInventory["comments"];

            $result = insertInventory($comments, $customerId, $endDateTime, $startDateTime, $supervisorId, $mysql);
            //cesult = getCustomerId($email, $mysql);
            $resultInfo = json_decode($result, true);
            //print_r($userInfo);
            if ($resultInfo['status']=="success") {
              $currentInventory["id"] = $resultInfo['id'];
              $currentInventory["is_selected"] = true;
              echo '{"status":"success","currentInventory":' . json_encode($currentInventory) ."}";
              //echo $result;
                //$jsonString = '{"status":"success","customer_id":' . $customerInfo['customer_id'] .'}';
            }
            else {
                die( '{"status":"failed","message":"The inventory could not be inserted - addInventory", "error":203}');
            }
            
            //echo $currentInventory["customer_id"];
            //print_r($currentInventory);
            break;
        default:
            die('{"status":"failed","message":"The action has not been defined", "error":1002}');
            break;
    }
} else {
    die('{"status":"failed","message":"The action was not set", "error":1001}');
}

function is_localhost()
{
    //echo "is";
    $whitelist = array('127.0.0.1', '::1');
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}
