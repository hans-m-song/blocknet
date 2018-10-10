function submitForm() {
    var XHR = new XMLHttpRequest();
    

    var name = $("#nameInput").val();
    var email = $("#emailInput").val();
    var proficiency = $("#proficiencySelect option:selected").val();
    var interest = $("#interestSelect option:selected").val();
    console.log("name:", name, "email:", email, "proficiency", proficiency, interest);
    
}