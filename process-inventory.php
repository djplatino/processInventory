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
        case "uploadFile":
            $fileName=""; 
            //print_r($_POST);
            print_r($_FILES);
            echo count($_FILES);
            foreach ($_FILES["files"]["error"] as $key => $error)
            {
                if ($error == UPLOAD_ERR_OK){
                    $name = $_FILES["files"]["name"][$key];
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    $ext = strtolower($ext);
                    switch($ext) {
                        case "json":
                            if(file_exists('uploads/'.$name)){
                                unlink('uploads/'.$name);
                            }
                            move_uploaded_file( $_FILES["files"]["tmp_name"][$key], "uploads/" . $name);
                            $json = file_get_contents("uploads/". $name);
                            //Decode JSON
                            //$json_data = json_decode($json,true);
                            $json_data = json_decode($json);

                            //Print data
                            //print_r($json_data);
                            //print_r($json_data["inventory"][0]);
                            //print_r($json_data->inventory[0]->area);

                            break;
                        default:
                            break;
                    }
                }
            }    


            echo '{"status":"success","data":' . $json . '}';
            break;
        default:
            die('{"status":"failed","message":"The action has not been defined", "error":1002}');
            break;
    }
} else {
    //die('{"status":"failed","message":"The action was not set", "error":1001}');
    //print_r(count($_FILES));
    //foreach ($_FILES["files"]["error"] as $key => $error)
    //{
    //};
    //print_r($_FILES);
    if (count($_FILES) > 0 && $_FILES["inventory"]["error"] == 0) {
        //print_r($_FILES["files"]["error"]);
        $name = $_FILES["inventory"]["name"];
        $ext = pathinfo($name, PATHINFO_EXTENSION);
        $ext = strtolower($ext);
        if(file_exists('uploads/'.$name)){
            unlink('uploads/'.$name);
        }
        move_uploaded_file( $_FILES["inventory"]["tmp_name"], "uploads/" . $name);
        //move_uploaded_file( $_FILES["files"]["tmp_name"][$key], "uploads/" . $name);
        $json = file_get_contents("uploads/". $name);
        //print_r($json);
        $json_data = json_decode($json);
        //print_r(json_last_error());
        //print_r($json_data);
        //echo $json_data;
        //print_r($json);
        //echo $name . " " . $ext;

        echo '{"status":"sucess","message":"' . $name . ' was uploaded"}';
        //echo '{"status":"sucess","message":"error"}';

    }
    else {
        echo '{"status":"sucess","message":"error"}';
    }
   
    //json$json = json_encode($_FILES);
    //foreach ($_FILES["files"]["error"] as $key => $error)
    //{
   // }
   
    
}

function is_localhost()
{
    //echo "is";
    $whitelist = array('127.0.0.1', '::1');
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}
