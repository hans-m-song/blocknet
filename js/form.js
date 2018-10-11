const formToString = () => {
    var form = {
        name: ($("#nameInput").val() == '') ? 'null' : $("#nameInput").val(),
        email: ($("#emailInput").val() == '') ? 'null' : $("#emailInput").val(),
        proficiency: $("#proficiencySelect option:selected").val(),
        interest: $("#interestSelect option:selected").val()  
    };

    var str = [];
    for(var element in form) {
        if(form.hasOwnProperty(element)) {
            str.push(
                encodeURIComponent(element) + 
                '=' + 
                encodeURIComponent(form[element])
            );
        }
    }
    return str.join('&').replace('/%20/g', '+')
}

function submitForm() {
    const payload = formToString();
    console.log(payload);

    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

    XHR.addEventListener('load', function(event) {
        console.log('payload sent');
    });

    XHR.addEventListener('error', function(event) {
        console.log('error sending');
    });

    // TODO add link
    XHR.open('POST', '')
    XHR.send(payload);
}