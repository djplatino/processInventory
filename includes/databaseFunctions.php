<?php

function getInitialData(&$mysql)
{
    //echo '{"status":"success"}';
    //$returnString = "";
    $sql = "SELECT id,
                   is_supervisor,
                   auditor_name,
                   password
            FROM auditor";
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    //$itemFound = false;
    $auditors = array();
    while ($auditor = mysqli_fetch_object($result)) {
        //$itemFound = true;
        $auditors[] = $auditor;
      
    }
    
    $sql = "SELECT id,
                   address_01,
                   address_02,
                   city,
                   customer_name,
                   customer_type,
                   email,
                   postal_code,
                   state
            FROM  customer";
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    //$itemFound = false;
    $customers = array();
    while ($row = mysqli_fetch_object($result)) {
        //$itemFound = true;
        $customers[] = $row;
    }

    $sql = "SELECT a.id,
                   a.comments,
                   a.customer_id,
                   a.end_date_time,
                   a.start_date_time,
                   a.supervisor_id,
                   b.customer_name,
                   c.auditor_name

            FROM  inventory a,
                  customer b,
                  auditor c
            WHERE a.customer_id   = b.id
            AND   a.supervisor_id = c.id";
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    //$itemFound = false;
    $inventories = array();
    while ($row = mysqli_fetch_object($result)) {
        //$itemFound = true;
        $inventories[] = $row;
    }

    
    //if ($itemFound){

    //$jsonString = '{"status":"success","auditors":' . json_encode($auditors) . '}';
    //}
    //else {
    //$jsonString='{"status":"success","message":"No data found","error_number":100}';
    //}
    //print_r(json_encode($auditors));
    return '{"status":"success"
            ,"auditors":' . json_encode($auditors) .
           ',"inventories":' . json_encode($inventories) .  
           ',"customers":' . json_encode($customers) . '}';

}

function insertCustomer($email, $customerName, &$mysql)
{
    $jsonString = "";

    $customerIdResult = getCustomerId($email, $mysql);
    $customerInfo = json_decode($customerIdResult, true);
    //print_r($userInfo);
    if ($customerInfo['status'] == "success") {
        $jsonString = '{"status":"success","customer_id":' . $customerInfo['customer_id'] . '}';
    } else {
        $sqlInsert = "INSERT INTO customer (email, customer_name)
                        VALUES('" . mysqli_real_escape_string($mysql, $email) . "',"
        . "'" . mysqli_real_escape_string($mysql, $customerName) . "')";
        //echo $sqlInsert;
        if (!mysqli_query($mysql, $sqlInsert)) {
            die('{"status":"failed","message":"Database error on insertCustomer","error":203}');
        }
        $idCreated = mysqli_insert_id($mysql);
        $jsonString = '{"status":"success","customer_id":' . $idCreated . '}';
        //$jsonString = '{"status":"success","message":"Review has been received"}';
    }
    return $jsonString;
}

function insertCustomerOrder($customerId, $chargeCustomerId, $orderDate, $transactionId, $amount, $appId, $jwt, &$mysql)
{
    $jsonString = "";

    //$customerIdResult = getCustomerId($email, $mysql);
    //$customerInfo = json_decode($customerIdResult, true);
    //print_r($userInfo);
    //if ($customerInfo['status']=="success") {
    //  $jsonString = '{"status":"success","customer_id":' . $customerInfo['customer_id'] .'}';
    //}
    //else {
    $sqlInsert = "INSERT INTO customer_order (customer_id
                                               ,charge_customer_id
                                               ,order_date
                                               ,transaction_id
                                               ,amount
                                               ,app_id
                                               ,jwt)
                      VALUES(" . $customerId . ","
    . "'" . mysqli_real_escape_string($mysql, $chargeCustomerId) . "',"
    . $orderDate . ","
    . "'" . mysqli_real_escape_string($mysql, $transactionId) . "',"
    . $amount / 100 . ","
    . $appId . ","
    . "'" . mysqli_real_escape_string($mysql, $jwt) . "')";
    //echo $sqlInsert;
    if (!mysqli_query($mysql, $sqlInsert)) {
        die('{"status":"failed","message":"Database error on insertCustomerOrder","error":203}');
    }
    $idCreated = mysqli_insert_id($mysql);
    $jsonString = '{"status":"success","customer_order_id":' . $idCreated . '}';
    //$jsonString = '{"status":"success","message":"Review has been received"}';
    //}
    return $jsonString;
}

function getApp($appId, &$mysql)
{
    $returnString = "";
    $sql = "SELECT id,
                      short_description,
                      app_description,
                      discount,
                      discount_expiration,
                      os,
                      price,
                      info_link
               FROM app where id = " . $appId;
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    $itemFound = false;
    $rows = array();
    while ($row = mysqli_fetch_object($result)) {
        $itemFound = true;
        $rows[] = $row;
    }
    if ($itemFound) {

        $jsonString = '{"status":"success","data":' . json_encode($rows) . '}';
    } else {
        $jsonString = '{"status":"failed","message":"No data found","error_number":100}';
    }
    return $jsonString;
}

function getApps(&$mysql)
{
    $returnString = "";
    $sql = "SELECT id,
                      short_description,
                      app_description,
                      discount,
                      discount_expiration,
                      os,
                      price,
                      info_link
               FROM app";
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    $itemFound = false;
    $rows = array();
    while ($row = mysqli_fetch_object($result)) {
        $itemFound = true;
        $rows[] = $row;
    }
    if ($itemFound) {

        $jsonString = '{"status":"success","data":' . json_encode($rows) . '}';
    } else {
        $jsonString = '{"status":"failed","message":"No data found","error_number":100}';
    }
    return $jsonString;
}

function getCustomer($email, &$mysql)
{
    $sql = "SELECT id,two_jwt,full_jwt  FROM customer WHERE email='" . mysqli_real_escape_string($mysql, $email) . "'";
    $result = mysqli_query($mysql, $sql);
    $rows = array();
    $customerFound = false;
    $jsonString = '{"status":"failed","message":"Customer was not found", "error":206}';
    while ($row = mysqli_fetch_object($result)) {
        $jsonString = '{"status":"success","customer_id":' . $row->id . ',"twoJWT":"' . $row->two_jwt . '","fullJWT":"' . $row->full_jwt . '"}';
    }

    return $jsonString;
}

function getCustomerId($email, &$mysql)
{
    $sql = "SELECT id FROM customer WHERE email='" . mysqli_real_escape_string($mysql, $email) . "'";
    $result = mysqli_query($mysql, $sql);
    $rows = array();
    $customerFound = false;
    $jsonString = '{"status":"failed","message":"Customer was not found", "error":206}';
    while ($row = mysqli_fetch_object($result)) {
        $jsonString = '{"status":"success","customer_id":' . $row->id . '}';
    }

    return $jsonString;
}

function getCustomerOrder($email, &$mysql)
{

    $sql = "SELECT a.order_id
                    ,a.customer_id
                    ,a.charge_customer_id
                    ,a.order_date
                    ,a.transaction_id
                    ,a.amount
                    ,a.app_id
                    ,a.uuid
                    ,a.install_count
                    ,a.jwt
                    ,b.initial_jwt
                    ,b.two_jwt
                    ,b.full_jwt
              FROM customer_order a
                  ,customer b
              WHERE a.order_id = (SELECT max(mo.order_id)
                                  FROM customer_order mo
                                  WHERE a.customer_id = mo.customer_id)
              AND   a.customer_id = b.id
              AND   b.email = '" . mysqli_real_escape_string($mysql, $email) . "'";
    //echo $sql;
    $result = mysqli_query($mysql, $sql);
    $rows = array();
    $customerFound = false;
    $jsonString = '{"status":"failed","message":"Customer was not found(' . $email . ') ", "error":206}';
    while ($row = mysqli_fetch_object($result)) {
        $jsonString = '{"status":"success","customer_order":' . json_encode($row) . '}';
    }

    return $jsonString;
}

function getCustomerOrderx($customerId, $uuid, &$mysql)
{

    $sql = "SELECT a.order_id
              FROM customer_order a
              WHERE a.order_id = (SELECT max(mo.order_id)
                                  FROM customer_order mo
                                  WHERE a.customer_id = mo.customer_id)
              AND   a.customer_id = " . $customerId .
        " AND   a.uuid is null";
    $result = mysqli_query($mysql, $sql);
    while ($row = mysqli_fetch_object($result)) {
        $sqlUpdate = "UPDATE customer_order a
                      SET a.uuid = '" . mysqli_real_escape_string($mysql, $uuid) . "'" .
        ",    a.status_message = 'initial update' " .
        ",    a.install_count = 1 " .
        " WHERE a.order_id = " . $row->order_id;
        if (!mysqli_query($mysql, $sqlUpdate)) {
            die('{"status":"failed","message":"Database error on getCustomerOrder update ","error":203}');
        }
        //$jsonString = '{"status":"success","customer_order":'. json_encode($row) . '}';
    }

    $sql = "SELECT a.order_id
                    ,a.charge_customer_id
                    ,a.order_date
                    ,a.transaction_id
                    ,a.amount
                    ,a.app_id
                    ,a.uuid
                    ,a.jwt
                    ,a.uuid
                    ,a.install_count
                    ,b.short_description
              FROM customer_order a
                  ,app b
              WHERE a.order_id = (SELECT max(mo.order_id)
                                  FROM customer_order mo
                                  WHERE a.customer_id = mo.customer_id)
              AND   a.app_id = b.id
              AND   a.customer_id = " . $customerId;
    //echo $sql;
    $result = mysqli_query($mysql, $sql);
    $rows = array();
    $customerFound = false;
    $jsonString = '{"status":"failed","message":"Customer was not found", "error":206}';
    while ($row = mysqli_fetch_object($result)) {
        $jsonString = '{"status":"success","customer_order":' . json_encode($row) . '}';
    }

    return $jsonString;
}

function getItemMaster(&$mysql)
{
    $returnString = "";
    $sql = "SELECT item_id,
                     item_description,
                     quantity_on_hand,
                     department,
                     department_description,
                     unit_of_measure,
		     item_price
              FROM retail_item_master";
    //LIMIT 1500";
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    $itemFound = false;
    $rows = array();
    while ($row = mysqli_fetch_object($result)) {
        $itemFound = true;
        $rows[] = $row;
    }
    if ($itemFound) {
        $jsonString = json_encode($rows);
    } else {
        $jsonString = "";
    }
    return $jsonString;
}

function getInventory(&$mysql)
{
    $returnString = "";
    $sql = "SELECT inv_sequence,
                     item_id,
                     inv_quantity,
                     inv_area,
                     inv_section
              FROM retail_inventory";
    //LIMIT 10";
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    $itemFound = false;
    $rows = array();
    while ($row = mysqli_fetch_object($result)) {
        $itemFound = true;
        $rows[] = $row;
    }
    if ($itemFound) {
        $jsonString = json_encode($rows);
    } else {
        $jsonString = "";
    }
    return $jsonString;
}

function getSounds(&$mysql)
{
    $returnString = "";
    $sql = "SELECT sound_id,
                     sound_description
              FROM sound_ids";
    //LIMIT 10";
    //echo $sql;
    mysqli_query($mysql, 'SET NAMES utf8');
    $result = mysqli_query($mysql, $sql);
    $itemFound = false;
    $rows = array();
    while ($row = mysqli_fetch_object($result)) {
        $itemFound = true;
        $rows[] = $row;
    }
    if ($itemFound) {
        $jsonString = json_encode($rows);
    } else {
        $jsonString = "";
    }
    return $jsonString;
}

function updateCustomer($customerId, $address01, $address02, $city, $state, $postalCode, $initialJWT, $twoJWT, $fullJWT, &$mysql)
{
    $sqlUpdate = "UPDATE customer a
                  SET a.address_01  = '" . mysqli_real_escape_string($mysql, $address01) . "'" .
    ",    a.address_02  = '" . mysqli_real_escape_string($mysql, $address02) . "'" .
    ",    a.city        = '" . mysqli_real_escape_string($mysql, $city) . "'" .
    ",    a.state       = '" . mysqli_real_escape_string($mysql, $state) . "'" .
    ",    a.postal_code = '" . mysqli_real_escape_string($mysql, $postalCode) . "'" .
    ",    a.initial_jwt = '" . mysqli_real_escape_string($mysql, $initialJWT) . "'" .
    ",    a.two_jwt     = '" . mysqli_real_escape_string($mysql, $twoJWT) . "'" .
    ",    a.full_jwt    = '" . mysqli_real_escape_string($mysql, $fullJWT) . "'" .
        " WHERE a.id = " . $customerId;
    if (!mysqli_query($mysql, $sqlUpdate)) {
        die('{"status":"failed","message":"Database error on updateCustomer update ","error":203}');
    }
    $jsonString = '{"status":"success","message":"customer ' . $customerId . ' has been updated"}';
    return $jsonString;
}

function updateCustomerFull($customerId, $fullJWT, &$mysql)
{
    $sqlUpdate = "UPDATE customer a
                  SET a.full_jwt    = '" . mysqli_real_escape_string($mysql, $fullJWT) . "'" .
        " WHERE a.id = " . $customerId;
    if (!mysqli_query($mysql, $sqlUpdate)) {
        die('{"status":"failed","message":"Database error on updateCustomerFull update ","error":203}');
    }
    $jsonString = '{"status":"success","message":"customer ' . $customerId . ' has been updated"}';
    return $jsonString;
}

function updateCustomerOrder($orderId, $uuid, $installCount, $statusMessage, &$mysql)
{
    $sqlUpdate = "UPDATE customer_order a
                  SET a.uuid  = '" . mysqli_real_escape_string($mysql, $uuid) . "'" .
    ",    a.status_message  = '" . mysqli_real_escape_string($mysql, $statusMessage) . "'" .
        ",    a.install_count   = " . $installCount .
        " WHERE a.order_id = " . $orderId;
    //echo $sqlUpdate;
    if (!mysqli_query($mysql, $sqlUpdate)) {
        die('{"status":"failed","message":"Database error on updateCustomerOrder update ","error":203}');
    }
    $jsonString = '{"status":"success","message":"order ' . $orderId . ' has been updated"}';
    return $jsonString;
}
