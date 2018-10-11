<?php
	require("inc/connectDB.php");
	include("inc/sessionStart.php");

	$form_name = "";
	$form_email = "";
	$form_proficiency = "";
	$form_interest = "";

	/*
$stmt = $db->prepare("SELECT * FROM InterestedParty");
$stmt->execute();
$result = $stmt->fetch();
echo "<script>alert('". $result['Name'] ."');</script>";*/

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$form_name = test_input($_POST["nameInput"]);		
		$form_email = test_input($_POST["emailInput"]);
		$form_proficiency = test_input($_POST["proficiencySelect"]);
		$form_interest = test_input($_POST["interestSelect"]);

		try {
			$stmt = $_SESSION["DBLink"]->prepare('INSERT INTO `InterestedParty` (`Name`, `Email`, `Proficiency`, `Interest`) VALUES (:form_name, :form_email, :form_proficiency, :form_interest);');
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