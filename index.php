<?php
	require("inc/connectDB.php");
	include("inc/sessionStart.php");

	static $recorded = false;
	if(!$recorded) {
		try {
                $date = date("Y-m-d");
                $stmt = $db->prepare("UPDATE WebsiteMetrics SET Visits = Visits + 1 WHERE day = :day");
                $stmt->execute(array(':day' => $date));
            if($stmt->rowCount() == 0) {
                $date = date("Y-m-d");
                $stmt = $db->prepare("INSERT INTO WebsiteMetrics (Day, Visits, Submissions) VALUES (:day, :visits, :submissions)");
                $stmt->execute(array(':day' => $date,
                                    ':visits' => 1,
                                    ':submissions' => 0
                                    )
                                );
			}
			$recorded = true;
		} catch (PDOException $ex) {
			exit();
		}
	}

	if (isset($_POST['form_submit'])) {

        $form_name = "";
        if(isset($_POST['nameInput'])) {
			$form_name = test_input($_POST["nameInput"]);
            unset($_POST['nameInput']);	
        }	

        $form_email = "";
        if(isset($_POST['emailInput'])) {
			$form_email = test_input($_POST["emailInput"]);
            unset($_POST['emailInput']);
        }

        $form_proficient = "";
        if(isset($_POST['Proficient'])) {
			$form_proficient = test_input($_POST["Proficient"]);
            unset($_POST['Proficient']);
        }

        $form_familiar = "";
        if(isset($_POST['Familiar'])) {
			$form_familiar = test_input($_POST["Familiar"]);
            unset($_POST['Familiar']);
        }

        $form_features = "";
        if(isset($_POST['fav-feature'])) {
            $favs = $_POST["fav-feature"];

            foreach($favs as $fav) {
                $form_features .= $fav . " ";
            }
            unset($_POST['fav-feature']);
        }

			try {
				$stmt = $db->prepare("INSERT INTO InterestedParty (Name, Email, Proficient, Familiar, Features) VALUES (:form_name, :form_email, :form_proficient, :form_familiar, :form_features)");
				$stmt->execute(array(':form_name' => $form_name,
									':form_email' => $form_email,
									':form_proficient' => $form_proficient,
									':form_familiar' => $form_familiar,
                                    ':form_features' => $form_features
									)
								);
			} catch (PDOException $ex) {
				exit();
			}

			try {
				$date = date("Y-m-d");
				$stmt = $db->prepare("UPDATE WebsiteMetrics SET Submissions = Submissions + 1 WHERE day = :day");
				$stmt->execute(array(':day' => $date));
			} catch (PDOException $ex) {
				exit();
			}

			unset($_POST['form_submit']);
            header("Location: index.php");

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
		
		<button type="button" class="navbar-toggle navbar-toggle-dark collapsed glyphicon glyphicon-menu-hamburger" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false"></button>

        <nav class="nav header-nav collapse navbar-collapse" id="navbar-collapse">
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
        <div id="blocknet" class="carousel-container section">
            <h2>What is Block Net?</h2>
			<div id="myCarousel" class="carousel slide" data-ride="carousel">
				<ol class="carousel-indicators">
					<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
					<li data-target="#myCarousel" data-slide-to="1"></li>
					<li data-target="#myCarousel" data-slide-to="2"></li>
					<li data-target="#myCarousel" data-slide-to="3"></li>
				</ol>
				<div class="carousel-inner">
					<div class="item active">
							<img class="d-block w-100" img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="First slide">
						<div class="carousel-caption">
							<h2>True P2P Online Messaging</h2>
							<p>Block Net offers messaging through IPFS decentralised storage and the blockchain</p>
						</div>
					</div>
					<div class="item">
							<img class="d-block w-100" img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="Second slide">
						<div class="carousel-caption">
							<h2>Your messages are valuable</h2>
							<p>Block Net messages use a token economy system to ensure you receive only the most important messages</p>
						</div>
					</div>
					<div class="item">
							<img class="d-block w-100" img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="Third slide">
						<div class="carousel-caption">
							<h2>Private messages are actually private</h2>
							<p>Instead of throwing them onto a server, messages are stored by you</p>
						</div>
					</div>
					<div class="item">
							<img class="d-block w-100" img src="https://drive.google.com/uc?id=1_0Q-tE86SUVCfrzMQZt1ZM5qj-9lwqD1" alt="Fourth slide">
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
        <div id="demo" class="mvp-video section">
            <h2>Video Demonstration</h2>
				<div class="video-frame">
				<iframe width="560" height="315" src="https://www.youtube.com/embed/FBGG9YmHcwo" frameborder="0" allow="autoplay; encrypted-media"
                allowfullscreen></iframe>
			</div>
        </div>
		<div id="blockchain" class="blockchain-cards section">
			<h2>The Technology</h2>
				<div class="row justify-content-center no-gutters">
					<div class="col-md-4 tech-logo-container">
						<embed class="tech-logo" type="image/svg+xml" src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg">
				</div>
					<div class="col-md-8 tech-intro">
						<h5><a class="intro-link" href="https://www.ethereum.org/">Ethereum</a></h5>
						<p>
							An open-source, public, blockchain-based distributed computing platform.
							Their highly secure verification and econonomy system means anything that shouldn't be touched by unauthorized
							users will not be.
							In addition, they provide scripting functionality through Smart Contracts (or Dapps) which acts directly on the
							blockchain.
							This is where our most sensitive data is stored. 
						</p>
				</div>
			</div>
				<div class="row justify-content-center no-gutters">
					<div class="col-md-4 tech-logo-container">
						<embed class="tech-logo" type="image/svg+xml" src="src/ipfs-logo.svg">
					</div>
					<div class="col-md-8 tech-intro">
						<h5><a class="intro-link" href="https://ipfs.io/">IPFS (Inter-Planetary File System)</a></h5>
						<p>
							One major drawback of using the Ethereum blockchain is the verification time for creating each block (around 17
							seconds).
							To get around having to wait for each new block to retrieve messages and avoid the transaction cost of each
							message,
							messages are stored in IPFS repositories which provide a distributed storage solution, providing both data
							redundancy and annonymity.
							Additionally, users can create their own 
						</p>
						</div>
				</div>

		</div>
        <div id="about" class="about-us section">
            <h2>Team 8 Hearts 1 Beat</h2>
			<p>Team 8 Hearts 1 Beat is a group of 3rd year undergraduates at the University of Queensland. The team was formed for the purpose of this project which is being undertaken as part of the DECO3801 Design Studio 3 course.</p>
			<p>Block Net is being completed for our industry client Ben Rose of <a href="http://mindfire.io/">Mindfire Design and Development</a>.</p>
			<p>Team members:</p>
			<ul>
				<li>Hans Song</li>
				<li>Asher Leung</li>
				<li>Bodhi Howe</li>
				<li>Craig Harvey</li>
				<li>Hernan Isaac Ocana Flores</li>
				<li>Yuki Nakazawa</li>
				<li>Simon Curtis</li>
				<li>James Fechner</li>
			</ul>
		</div>
		<div id="register-interest" class="register-interest section">
			<h2>Register Your Interest</h2>
			<h4>Let us know about you</h4>
			<form method="post" action="">
				<div class="form-groups">
					<label for="nameInput">Name</label>
					<input type="text" class="form-control" id="nameInput" name="nameInput" placeholder="Enter name">
				</div>
				<div class="form-groups">
					<label for="emailInput">Email</label>
					<input type="text" class="form-control" id="emailInput" name="emailInput" placeholder="Enter email">
				</div>
				<div class="form-groups">
					<label>Age group</label>
					<select class="form-control" id="ageBracket" name="ageBracket">
						<option value="0" name="ageGroup">Prefer not to answer</option>
						<option value="1" name="ageGroup">12-17</option>
						<option value="2" name="ageGroup">18-24</option>
						<option value="3" name="ageGroup">25-34</option>
						<option value="4" name="ageGroup">35-44</option>
						<option value="5" name="ageGroup">45-54</option>
						<option value="6" name="ageGroup">55-64</option>
						<option value="7" name="ageGroup">65+</option>
					</select>	
				</div>
				<div class="form-groups">
					<label for="proficiencySelect">What is your level of proficiency with technology?</label>
						<ul class="likert">
							<li class="likert"> Unfamiliar <input id="radProfStart" type="radio" name="Proficient" value="1" required/>
							<li class="likert"><input type="radio" name="Proficient" value="2" />
							<li class="likert"><input type="radio" name="Proficient" value="3" />
							<li class="likert"><input type="radio" name="Proficient" value="4" />
							<li class="likert"><input id="radProfEnd" type="radio" name="Proficient" value="5" /> Tech Savvy
						</ul>
				</div>
				<div class="form-groups">
					<label for="interestSelect">How familiar are you with blockchain technology?</label>
						<ul class="likert">
							<li class="likert"> Unfamiliar <input id="radBlkStart" type="radio" name="Familiar" value="1" required/>
							<li class="likert"><input type="radio" name="Familiar" value="2" />
							<li class="likert"><input type="radio" name="Familiar" value="3" />
							<li class="likert"><input type="radio" name="Familiar" value="4" />
							<li class="likert"><input id="radBlkEnd" type="radio" name="Familiar" value="5" /> Knowledgeable
						</ul>
				</div>
				<div class="form-groups">
					<label for="favFeature">What features interest you about Block Net?</label>
					<div class="fav-feature-list" id="favFeature">
						<input type="checkbox" name="fav-feature[]" value="data"> Data security and privacy<br>
						<input type="checkbox" name="fav-feature[]" value="tech"> The use of cutting edge technology<br>
						<input type="checkbox" name="fav-feature[]" value="friends"> Talking with friends online<br>
						<input type="checkbox" name="fav-feature[]" value="community"> Participating in it's online community<br>
						<input type="checkbox" name="fav-feature[]" value="learn"> The ability to see and learn how a decentralised application works<br>
					</div>
				</div>
				<input id="submission" type="submit" name="form_submit" class="btn btn-secondary">
			</form>
		</div>
		<div id="social-media" class="social-media section">
			<h4>Let people know about us</h4>
			<div class="social-media">
				<iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2F8hearts1beat.uqcloud.net&width=96&layout=button&action=like&size=small&show_faces=true&share=true&height=65&appId=206978356552149" 
					width="96" height="20" 
					style="border:none;overflow:hidden" 
					scrolling="no" 
					frameborder="0" allowTransparency="true" 
					allow="encrypted-media">
				</iframe>
	
				<a 
					href="https://twitter.com/share?ref_src=twsrc%5Etfw" 
					class="twitter-share-button" 
					data-show-count="false"
					data-text="Check out Block Net! A serverless, blockchain based forum"
					data-url="https://8hearts1beat.uqcloud.net"
					data-hashtags="blockchain,ethereum,ipfs,forum">
					Tweet
				</a>
				<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

				<script src="https://platform.linkedin.com/in.js" type="text/javascript"> lang: en_US</script>
				<script type="IN/Share" data-url="https://8hearts1beat.uqcloud.net"></script>
			</div>
        </div>
    </div>

    <div class="footer">
        <p>8 Hearts 1 Beat, 2018 | DECO3801 | <a href="metrics.php" id="metrics">Metrics</a></p>
	</div>
	</div>
</body>

</html>