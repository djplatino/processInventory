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
            $inventoryId = $POST["inventory_id"];
            echo getInventoryCounts($mysql, $inventoryId);
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
        case "deleteInventory":
            $deleteCounts     = $POST['deleteCounts'];
            $deleteFiles      = $POST['deleteFiles'];
            $deleteItemMaster = $POST['deleteItemMaster'];
            $areaToDelete     = $POST['areaToDelete'];
            $fileToDelete     = $POST['fileToDelete'];
            
            $sectionToDelete  = $POST['sectionToDelete'];
            $auditorToDelete  = $POST['auditorToDelete'];
            $itemMasterToDelete = $POST['itemMasterToDelete'];

            if (isset($POST['filesToDelete'])) {
                $filesToDelete    = $POST['filesToDelete'];
            }
            else {
                $filesToDelete    = [];
            }

            //print_r($POST);
            
            
            //echo $deleteCounts;
            //echo $deleteFiles;
            //echo $deleteItemMaster;
            /*
            if ($deleteCounts == "Y" && $deleteFiles == "Y") {
                echo '{"status":"success","info":' . $deleteCounts . '}';
            }
            else {
                echo '{"status":"success","more info":' . $deleteFiles . '}';
            }
            
            */


            
            switch(true){
                case ($deleteCounts == "Y" 
                  && $deleteFiles == "Y" 
                  && $deleteItemMaster == "Y"
                  && $areaToDelete == ""
                  && $sectionToDelete == ""
                  && $fileToDelete == ""
                  && $auditorToDelete == ""):

                    $result =  deleteAllInventory($mysql);
                    echo $result;
                    foreach ($filesToDelete as $file)
                    {
                        if(file_exists('uploads/'.$file)){
                            //echo $file;
                            unlink('uploads/'.$file);
                        }
                    }
                    if(file_exists('itemMaster/'.$itemMasterToDelete)){
                        //echo $itemMasterToDelete;
                        unlink('itemMaster/'.$itemMasterToDelete);
                    }
                    //echo '{"status":"success","info00":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "Y" 
                    && $deleteFiles == "Y" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):
                      
                        $result =  deleteAllInventory($mysql);
                        echo $result;
                        foreach ($filesToDelete as $file)
                        {
                            if(file_exists('uploads/'.$file)){
                                //echo $file;
                                unlink('uploads/'.$file);
                            }
                        }
                        //echo '{"status":"success","info01":' . $deleteCounts . '}';
                        break;
                case ($deleteCounts == "Y" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "Y"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):
                    $result =  deleteAllInventory($mysql);
                    echo $result;
                    if(file_exists('itemMaster/'.$itemMasterToDelete)){
                        //echo $itemMasterToDelete;
                        unlink('itemMaster/'.$itemMasterToDelete);
                    }    
                    //echo '{"status":"success","info02":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "Y" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):
                    $result =  deleteAllInventory($mysql);
                    echo $result;
                    /*
                    $resultInfo = json_decode($result, true);
                    if ($resultInfo['status']=="success") {
                        //echo '{"status":"success","info03":' . $deleteCounts . '}';
                        echo $result;

                    }
                    else {
                        echo $result;
                    }*/


                    
                    break;
                case ($deleteCounts == "N" 
                    && $deleteFiles == "Y" 
                    && $deleteItemMaster == "Y"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):

                    foreach ($filesToDelete as $file)
                        {
                            if(file_exists('uploads/'.$file)){
                                //echo $file;
                                unlink('uploads/'.$file);
                            }
                        }
                    if(file_exists('itemMaster/'.$itemMasterToDelete)){
                        //echo $itemMasterToDelete;
                        unlink('itemMaster/'.$itemMasterToDelete);
                    }
                    echo '{"status":"success","info04":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "N" 
                    && $deleteFiles == "Y" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):
                    echo $filesToDelete[0];
                    foreach ($filesToDelete as $file)
                    {
                        if(file_exists('uploads/'.$file)){
                            //echo $file;
                            unlink('uploads/'.$file);
                        }
                    }

                    echo '{"status":"success","info05":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "N" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "Y"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):
                    
                    if(file_exists('itemMaster/'.$itemMasterToDelete)){
                        //echo $itemMasterToDelete;
                        unlink('itemMaster/'.$itemMasterToDelete);
                    }

                    //echo $itemMasterToDelete;
                    echo '{"status":"success","info06":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "N" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete != ""
                    && $auditorToDelete == ""): 
                        $result = deleteByFile($mysql, $fileToDelete);
                        echo $result;
                        //echo '{"status":"success","info3":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "N" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete == ""
                    && $sectionToDelete == ""
                    && $fileToDelete == ""
                    && $auditorToDelete != ""): 
                        $result = deleteByAuditor($mysql, $auditorToDelete);
                        echo $result;   
                        //echo '{"status":"success","info4":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "N" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete == "ALL"
                    && $sectionToDelete == "ALL"
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):    
                        echo '{"status":"success","info6":' . $deleteCounts . '}';
                case ($deleteCounts == "N" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete != ""
                    && $areaToDelete != "ALL"
                    && $sectionToDelete == "ALL"
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):    
                        $result = deleteByAREA($mysql, $areaToDelete);
                        echo $result;  
                        //echo '{"status":"success","info7":' . $deleteCounts . '}';
                    break;
                case ($deleteCounts == "N" 
                    && $deleteFiles == "N" 
                    && $deleteItemMaster == "N"
                    && $areaToDelete != ""
                    && $areaToDelete != "ALL"
                    && $sectionToDelete != "ALL"
                    && $sectionToDelete != ""
                    && $fileToDelete == ""
                    && $auditorToDelete == ""):    
                        echo '{"status":"success","info8":' . $deleteCounts . '}';
                    break;
                default:
                    echo '{"status":"success","infoD":' . $deleteFiles . '}';
                    break;
            }

            
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
