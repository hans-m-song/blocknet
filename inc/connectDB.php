<?php 
    //include_once("inc/credentials.php")
    
    $username = "webuser";
    $password = "w3KPXnLAihcrejYA";
    $host = "localhost";
    $dbname = "marketing_stats";

    try {
       $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
       $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    } catch(PDOException $ex) {
       die("Failed to connect to the database.");
    }

?>