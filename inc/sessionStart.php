<?php
session_start();
//include("inc/logDBerror.php");    // Function definition for any DB calls

// php error logging directives (changes the state in the current PHP runtime/process only, it does not set the ini file)
ini_set("display_errors", 0);           // Don't display errors...
ini_set("log_errors", 1);               // but log them...
ini_set("error_log", "phpErrors.log");  // here

// Disable all attacks on session variables through GET and POST requests
if (isset($_REQUEST['_SESSION'])) {
  die("Invalid");
}

// If register_globals is On, global variables associated to $_SESSION variables are references
//   $_SESSION['test'] = 42;
//   $test = -1;             // Will change $_SESSION['test'] if below is not executed
$rg = ini_get('register_globals');
if ($rg || $rg=="") {
  foreach ($_SESSION as $key=>$value) {
    if (isset($GLOBALS[$key])) {
      unset($GLOBALS[$key]);
    }
  }
}
?>