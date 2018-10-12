//var proficient_data = <?php echo json_encode($proficient_data); ?>;
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
            label: '# of Votes',
            data: proficient_data,
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
            text: 'Number of people Proficient with Technology at a particular Level'
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

//var familiar_data = <?php echo json_encode($familiar_data); ?>;
var ctx = document.getElementById("myChart2").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    title: 'a title',
    data: {
        labels: ["Unfamiliar", "Novice", "Medium", "Proficient", "Knowledgeable"],
        datasets: [{
            label: '# of Votes',
            data: familiar_data,
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
            text: 'Number of people Familiar with BlockChain at a particular Level'
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

//var features_data = <?php echo json_encode($features_data); ?>;
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
            data: features_data,
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
