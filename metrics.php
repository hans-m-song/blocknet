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

    static $proficient_data = array();
    static $familiar_data = array();
    static $features_data = array();
    static $visits_data = array();
    static $submissions_data = array();

    $likert_options = array("1", "2", "3", "4", "5");
    $features = array("data", "tech", "friends", "community", "learn");

    try {
        foreach($likert_options as $option) {
            $proficient_data[] = retrieveDB($db, "InterestedParty", "Proficient", $option);
            $familiar_data[] = retrieveDB($db, "InterestedParty", "Familiar", $option);
        }
        foreach($features as $feature) {
        	$features_data[] = retrieveDB($db, "InterestedParty", "Features", $feature);
        }
    } catch(PDOException $ex) {
        error_log($ex->getMessage());
        exit();
    }

    function retrieveDB($db, $table, $col, $value) {
        try {
            $stmt = $db->prepare("SELECT COUNT({$col}) FROM ${table} WHERE {$col} LIKE %{$value}%");
            $stmt->execute();
            $result = $stmt->fetchColumn();
            return $result;
        } catch(PDOException $ex) {
            error_log($ex->getMessage());
            exit();
        }
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
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.min.js"></script>
    <link rel="shortcut icon" href="favicon.ico">
</head>
    <title>Site Statistics</title> 
<body>
    <!--div class="header navbar-fixed-top">
        <div>
            <h1 class="title">Block<span id="logo-holder">
                <img id="logo" src="src/console_active.png">
            </span>Net</h1>
        </div>
        
        <button type="button" class="navbar-toggle navbar-toggle-dark collapsed glyphicon glyphicon-menu-hamburger" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false"></button>

        <nav class="nav header-nav collapse navbar-collapse" id="navbar-collapse">
            <a class="nav-item btn" href="#blocknet">About Block Net</a>
            <a class="nav-item btn" href="#demo">Demonstration</a>
            <a class="nav-item btn" href="#blockchain">The Blockchain</a>
            <a class="nav-item btn" href="#about">About Us</a>
        </nav>

    </div-->
    <div class="container content">
    <h1 style="text-align: center;">Site Statistics</h1> 
        <div class="row">
            <div class="col-md-6">
                <div class="chart-container"> 
                    <canvas id="myChart" width="400" height="400"></canvas>
                </div>
            </div>
            <div class="col-md-6">
                <div class="chart-container"> 
                    <canvas id="myChart2" width="400" height="400" float: left></canvas>  
                </div>  
            </div>
        </div>  

        <div class="row">
            <div class="col-md-6">
                <div class="chart-container">
                    <canvas id="myChart3" width="400" height="400" float: left></canvas>
                </div>
            </div>
        </div>

    </div>

<script type="text/javascript" src="js/charts.js"></script>

</body>

</html>
