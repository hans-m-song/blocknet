<?php
	require("inc/connectDB.php");
	include("inc/sessionStart.php");

	if (isset($_POST['form_submit'])) {
		$form_name = test_input($_POST["nameInput"]);		
		$form_email = test_input($_POST["emailInput"]);
		$form_proficiency = test_input($_POST["proficiencySelect"]);
		$form_interest = test_input($_POST["interestSelect"]);

		try {
			$stmt = $db->prepare("INSERT INTO InterestedParty (Name, Email, Proficiency, Interest) VALUES (:form_name, :form_email, :form_proficiency, :form_interest)");
			$stmt->execute(array(':form_name' => $form_name,
								':form_email' => $form_email,
								'form_proficiency' => $form_proficiency,
								'form_interest' => $form_interest
								)
							);
		} catch (PDOException $ex) {
			exit();
		}
	}

	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
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
	<script type="text/javascript" src="js/box.js" async></script>
	<script type="text/javascript" src="js/form.js"></script>
    <link rel="shortcut icon" href="favicon.ico">
</head>
    <title>Block Net</title> 

<body>
			
	<div class="header navbar-fixed-top">
        <div>
			<h1 class="title">Block<span id="logo-holder">
				<img id="logo" src="src/console_active.png">
			</span>Net</h1>
        </div>

        <nav class="nav header-nav ">
            <a class="nav-item btn" href="#blocknet">About Block Net</a>
            <a class="nav-item btn" href="#demo">Demonstration</a>
            <a class="nav-item btn" href="#blockchain">The Blockchain</a>
            <a class="nav-item btn" href="#about">About Us</a>
        </nav>

    </div>
    
    <!--Will try to do some fancy scrolling, and adding 'links' to make a chain, etc with this stuff-->
    <!--Another idea is to have a '...' dialogue box that suggests someones about to send a message, is a button and creates new box and centres on it, kinda like how messaging in video games works-->
	<div class="container-fluid content">
    <div class="centre">
		<div class="padding"></div>
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
				<div id="ethereum-row" class="row justify-content-center no-gutters">
				<div class="col-md-4" class="logo-container">
					<embed id="ethereum-logo" type="image/svg+xml" src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg">
				</div>
				<div class="col-md-8" id="ethereum-intro">
						<h5><a id="intro-link" href="https://www.ethereum.org/">Ethereum</a></h5>
						<p>
							An open-source, public, blockchain-based distributed computing platform.
							Their highly secure verification and econonomy system means anything that shouldn't be touched by unauthorized users will not be.
							In addition, they provide scripting functionality through Smart Contracts (or Dapps) which acts directly on the blockchain.
							This is where our most sensitive data is stored. 
						</p>
				</div>
			</div>
				<div id="ipfs-row" class="row justify-content-center no-gutters">
				<div class="col-md-8" id="ipfs-intro">
						<h5><a id="intro-link" href="https://ipfs.io/">IPFS (Inter-Planetary File System)</a></h5>
						<p>
							One major drawback of using the Ethereum blockchain is the verification time for creating each block (around 17 seconds).
							To get around having to wait for each new block to retrieve messages and avoid the transaction cost of each message, 
							messages are stored in IPFS repositories which provide a distributed storage solution, providing both data redundancy and annonymity.
							Additionally, users can create their own 
						</p>
						</div>
				<div class="col-md-4" class="logo-container">
					<embed id="ipfs-logo" type="image/svg+xml" src="src/ipfs-logo.svg">
					</div>
				</div>

		</div>
        <div id="about" class="about-us">
            <h2>Team 8 Hearts 1 Beat</h2>
				<p>We're a group of 3rd year undergraduates at the University of Queensland. This project was undertaken under the
					course DECO3801 for our client Ben </p>
			<h2>Express Your Interest</h2>
			<div class="social-media">
			<div id="fb-root"></div>
					<div class="fb-like" data-href="https://8hearts1beat.uqcloud.net/" data-layout="button" data-action="like"
					 data-size="large" data-show-faces="false" data-share="true"></div>
			</div>
			<form method="post" action="index.php">
				<div class="form-groups">
					<label for="nameInput">Name</label>
					<input type="text" class="form-control" id="nameInput" name="nameInput" placeholder="Enter name">
				</div>
				<div class="form-groups">
					<label for="emailInput">Email</label>
					<input type="text" class="form-control" id="emailInput" name="emailInput" placeholder="Enter email">
				</div>
				<div class="form-groups">
					<label for="proficiencySelect">What is your level of proficiency with technology?</label>
					<select class="form-control" id="proficiencySelect" name="proficiencySelect">
						<option value="1">I use a computer sometimes</option>
						<option value="2">I'm familiar with using a browser and some software</option>
						<option value="3">I'm a power user, making use of most functions of the computer</option>
						<option value="4">I'm familiar with programming in some languages</option>
						<option value="5">I develop software for embeded systems or operating systems</option>
						<option value="6">I can use regex on HTML</option>
					</select>
				</div>
				<div class="form-groups">
					<label for="interestSelect">How familiar are you with blockchains?</label>
					<select class="form-control" id="interestSelect" name="interestSelect">
						<option value="1">What's a blockchain?</option>
						<option value="2">I've read about it but never touched it</option>
						<option value="3">I'm interested but don't know how to approach it</option>
						<option value="4">I own some cryptocurrency</option>
						<option value="5">I've developed Dapps and software around them</option>
					</select>
				</div>
				<input id="submission" type="submit" name="form_submit" class="btn btn-secondary">
			</form>

        </div>
    </div>

    <div class="footer">
        <p>8 Hearts 1 Beat, 2018 | DECO3801 | <a href="metrics.php" id="metrics">Metrics</a></p>
	</div>
	</div>
</body>

</html>