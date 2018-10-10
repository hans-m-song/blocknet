<?php
	require("inc/connectDB.php");
	include("inc/sessionStart.php");
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
    <title>Block Net</title> 

<body>
    <div class="header navbar-fixed-top" style="padding-bottom:0px; padding-top:5px;">
        <div>
			<h1 class="title">Block Net<span id="box"></span></h1>
			
        </div>

        <nav class="nav header-nav ">
            <a class="nav-item btn" href="index.php#blocknet">About Block Net</a>
            <a class="nav-item btn" href="index.php#demo">Demonstration</a>
            <a class="nav-item btn" href="index.php#blockchain">The Blockchain</a>
            <a class="nav-item btn" href="index.php#about">About Us</a>
        </nav>

    </div>
    
    <div class="jumbotron" id="box"></div>
    <!--Will try to do some fancy scrolling, and adding 'links' to make a chain, etc with this stuff-->
    <!--Another idea is to have a '...' dialogue box that suggests someones about to send a message, is a button and creates new box and centres on it, kinda like how messaging in video games works-->
    <div class="centre">
        <div id="blocknet" class="carousel-container">
            <h2>About Block Net</h2>
			<div id="myCarousel" class="carousel slide" data-ride="carousel">
				<ol class="carousel-indicators">
					<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
					<li data-target="#myCarousel" data-slide-to="1"></li>
					<li data-target="#myCarousel" data-slide-to="2"></li>
					<li data-target="#myCarousel" data-slide-to="3"></li>
				</ol>
				<div class="carousel-inner">
					<div class="item active">
						<img class = "d-block w-100" 
						img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="First slide">
						<div class="carousel-caption">
							<h2>True P2P Online Messaging</h2>
							<p>Block Net offers messaging through IPFS decentralised storage and the blockchain</p>
						</div>
					</div>
					<div class="item">
						<img class = "d-block w-100" 
						img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="Second slide">
						<div class="carousel-caption">
							<h2>Your messages are valuable</h2>
							<p>Block Net messages use a token economy system to ensure you receive only the most important messages</p>
						</div>
					</div>
					<div class="item">
						<img class = "d-block w-100" 
						img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="Third slide">
						<div class="carousel-caption">
							<h2>Private messages are actually private</h2>
							<p>Instead of throwing them onto a server, messages are stored by you</p>
						</div>
					</div>
					<div class="item">
						<img class = "d-block w-100" 
						img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="Fourth slide">
						<div class="carousel-caption">
							<h2>We have private rooms too</h2>
							<p>Block Net allows you to change everything about your chat rooms, from message cost to custom emotes</p>
						</div>
					</div>
				</div>
				<a class="left carousel-control" href="#myCarousel" data-slide="prev">
					<span class="glyphicon glyphicon-chevron-left"></span>
					<span class="sr-only">Previous</span>
				</a>
				<a class="right carousel-control" href="#myCarousel" data-slide="next">
					<span class="glyphicon glyphicon-chevron-right"></span>
					<span class="sr-only">Next</span>
				</a>
			</div>
        </div>
        <div id="demo" class="mvp-video">
            <h2>Demonstration</h2>
			<div class = "video-frame">
				<iframe width="560" height="315" src="https://www.youtube.com/embed/FBGG9YmHcwo" frameborder="0" allow="autoplay; encrypted-media"
                allowfullscreen></iframe>
			</div>
        </div>
		<div id="blockchain" class="blockchain-cards">
			<h2> The Blockchain </h2>
				<div class="grid-container">
					<div class="flip-card">
						<div class="flip-card-inner">
							<div class="flip-card-front">
								<h2>1</h2>
							</div>
							<div class="flip-card-back">
								<h2>2</h2>
							</div>
						</div>
					</div>
					<div class="flip-card">
						<div class="flip-card-inner">
							<div class="flip-card-front">
								<h2>3</h2>
							</div>
							<div class="flip-card-back">
								<h2>4</h2>
							</div>
						</div>
					</div>
					<div class="flip-card">
						<div class="flip-card-inner">
							<div class="flip-card-front">
								<h2>5</h2>
							</div>
							<div class="flip-card-back">
								<h2>6</h2>
							</div>
						</div>
					</div>
					<div class="flip-card">
						<div class="flip-card-inner">
							<div class="flip-card-front">
								<h2>7</h2>
							</div>
							<div class="flip-card-back">
								<h2>8</h2>
							</div>
						</div>
					</div>
				</div>
		</div>
        <div id="about" class="about-us">
            <h2>Team 8 Hearts 1 Beat</h2>
            <p>We're a group of 3rd year undergraduates at the University of Queensland. This project was undertaken under the course DECO3801 for our client Ben </p>
			<h2>Express Your Interest</h2>
			<form>
				<div class="form-groups">
					<label for="nameInput">Name</label>
					<input type="text" class="form-control" id="nameInput" placeholder="Enter name">
				</div>
				<div class="form-groups">
					<label for="emailInput">Name</label>
					<input type="text" class="form-control" id="emailInput" aria-describedby="emailHelp" placeholder="Enter email">
					<small id="emailHelp" class="form-text text-muted">Optional</small>
				</div>
				<div class="form-group">
					<label for="proficiencySelect">What is your level of proficiency with technology?</label>
					<select class="form-control" id="proficiencySelect">
						<option value="1">I use a computer sometimes</option>
						<option value="2">I'm familiar with using a browser and some software</option>
						<option value="3">I'm a power user, making use of most functions of the computer</option>
						<option value="4">I develop software and start my arrays at 0</option>
						<option value="5">I can almost use regex on HTML</option>
					</select>
				</div>
				<div class="form-group">
					<label for="interestSelect">How familiar are you with blockchains?</label>
					<select class="form-control" id="interestSelect">
						<option value="1">What's a blockchain?</option>
						<option value="2">I've read about it but never touched it</option>
						<option value="3">I'm interested but don't know how to approach it</option>
						<option value="4">I own some cryptocurrency</option>
						<option value="5">I've developed Dapps and software around them</option>
					</select>
				</div>
				<button type="submit" class="btn btn-secondary">Submit</button>
			</form>

        </div>
    </div>
    <footer>
        <p>8 Hearts 1 Beat, 2018 | DECO3801 | <a href="metrics.php" id="metrics">Metrics</a></p>
		
    </footer>
</body>

</html>