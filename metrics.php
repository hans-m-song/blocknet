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
<body>
    <title>Site Statistics</title> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.min.js"></script>
    <script src="js/chart.js"></script>


<div style="width: 100%; overflow: hidden; ">
    <div style="width: 600px; float: left; height: 700px"> 
	<canvas id="myChart" width="400" height="400"></canvas>
    </div>
    <div style="margin-left: 620px; height: 700px"> 
	<canvas id="myChart2" width="400" height="400" float: left></canvas> 
    </div>
    
</div>
<div style="width: 400px;">
	<canvas id="myChart3" width="400" height="400" float: left></canvas>
</div>
<script>
var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Unfamiliar", "Awkward", "Medium", "Familiar", "Tech-Savvy"],
        datasets: [{
            label: {
		display: false,
		text:'Number of people Profient with Technology at a paricular Level'
	    },
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
	title: {
            display: true,
            text: 'Number of people Profient with Technology at a paricular Level'
        },
	legend: {
        display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
myChart.defaults.global.legend.display = false;
</script>


<script>
var ctx = document.getElementById("myChart2").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    titel: 'a title',
    data: {
        labels: ["Unfamiliar", "Novice", "Medium", "Proficiant", "Knowledgable"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
	title: {
            display: true,
            text: 'Number of people Profient with BlockChain at a paricular Level'
        },
	legend: {
        display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
</script>


<script>
var ctx = document.getElementById("myChart3").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Data security and privacy", "The use of cutting edge technology", "Talking with friends online", 
		"Participating in its online community", "The ability to see and learn hpw a decentralised application works"],
        datasets: [{
            label: {
		display: false,
		text:'Number of people Profient with Technology at a paricular Level'
	    },
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
	title: {
            display: true,
            text: 'What features interest you about Block Net'
        },
        
    }
});
</script>


</body>

</html>
