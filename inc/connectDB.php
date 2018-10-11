<?php 
    //include_once("inc/credentials.php")
    
    $username = "webuser";
    $password = "w3KPXnLAihcrejYA";
    $host = "localhost";
    $dbname = "marketing_stats";

    try {
       $_SESSION['DBLink'] = new PDO("mysql:host=" . $host . ";dbname=" . $dbname . ";charset=utf8", $username, $password);
       $_SESSION['DBLink']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       $_SESSION['DBLink']->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    } catch(PDOException $ex) {
       die("Failed to connect to the database.");
    }

?>