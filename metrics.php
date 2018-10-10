<?php
	require("inc/connectDB.php");
	include("inc/sessionStart.php");

	//Author: Alex Pudmenzky
	$runAtUQ = true; //Change to false if not run on UQ zone

	if ($runAtUQ) {
		require_once "uq/auth.php";             // Include UQ routines that handle UQ single-signon authentication
		auth_require();                         // User must authenticate once per session to continue running script
	
	// Populate associative array containing UQ user details:
	//  "user" — the user's UQ username (eg uqxxx or s4xxxxxx)
	//  "email" — the user's primary email address
	//  "name" — the preferred name for addressing the user, eg "John Smith"
	//  "groups" — a list of AD and LDAP groups the user is a member of
		$UQ = auth_get_payload();
	}
?>

<!DOCTYPE html>
<html>

<head>
    <link href="https://fonts.googleapis.com/css?family=Do+Hyeon" rel="stylesheet">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="css/style.css">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/97/three.min.js"></script>
    <script type="text/javascript" src="js/script.js" async></script>
    <script type="text/javascript" src="js/box.js" async></script>
    <link rel="shortcut icon" href="favicon.ico">
</head>
    <title>Site Statistics</title> 

</html>