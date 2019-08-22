const form = document.getElementById('vote-form')

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const choice = document.querySelector('input[name=os]:checked').value
    const data = {os: choice}

    fetch("http://localhost:3000/poll",{
        method: "post",
        body: JSON.stringify(data),
        headers: new Headers(({
            'Content-Type': 'application/json'
        }))
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
})


fetch("http://localhost:3000/poll")
.then(res => res.json())
.then(data => {
    console.log(data)
    const votes = data.votes
    const totalVotes = votes.length
    const voteCounts = votes.reduce((acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc), {})

    console.log(voteCounts)
    dataPointsArray = []
    for(key in voteCounts){
        let dataPointObject = {
            label: key,
            y: voteCounts[key]
        }
        dataPointsArray.push(dataPointObject)
    }
    console.log(Object.values(dataPointsArray))
    let dataPoints = [
        {label: 'Windows', y: voteCounts.Windows},
        {label: 'MacOs', y: voteCounts.MacOs},
        {label: 'Linux', y: voteCounts.Linux},
        {label: 'Other', y: voteCounts.Other},
    ]

    const chartContainer = document.querySelector("#chartContainer")

    if(chartContainer){
        const chart = new CanvasJS.Chart('chartContainer', {
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: 'OS Results'
            },
            data: [
                {
                    type: 'column',
                    dataPoints: dataPoints
                }
            ]
        })
        chart.render()
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        var pusher = new Pusher('46ee32ae292a6885d35a', {
          cluster: 'us2',
          forceTLS: true
        });

        var channel = pusher.subscribe('os-poll');
        channel.bind('os-vote', function(data) {
          // alert(JSON.stringify(data));
            // console.log(data)
            dataPoints = dataPoints.map(x => {
                if(x.label == data.os){
                    x.y += data.points
                    // console.log(x.y)
                }
                return x
            })
            chart.render()
        });
    }

})
.catch(err => console.log(err))
