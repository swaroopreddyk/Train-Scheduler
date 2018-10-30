// Initialize Firebase
var config = {
    apiKey: "AIzaSyD2lXC5ys3Li84hDoV1ZBmBJ1qrvS6UQRA",
    authDomain: "mytrainscheduler-85d13.firebaseapp.com",
    databaseURL: "https://mytrainscheduler-85d13.firebaseio.com",
    projectId: "mytrainscheduler-85d13",
    storageBucket: "mytrainscheduler-85d13.appspot.com",
    messagingSenderId: "788548621243"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var trainDatabase = firebase.database();

$("#addTrainButton").on('click', () => {
    let name = $('#formTrainNameInput').val().trim();
    let destination = $('#formTrainDestinationInput').val().trim();
    let firstTrain = $('#formFirstTraininput').val().trim();
    let trainFreq = $('#formTrainFreqInput').val().trim();

    //create new JSON object to store to Firebase
    let trainObject = {
        trainName: name,
        trainDestination: destination,
        firstTrainTime: firstTrain,
        frequency: trainFreq
    };

    //Upload the new entry to Firebase
    trainDatabase.ref().push(trainObject);
    alert("Train successfully added");
    resetForm();
})

const resetForm = () => {
    // Clears all of the text-boxes
    $("#formTrainNameInput").val("");
    $("#formTrainDestinationInput").val("");
    $("#formFirstTraininput").val("");
    $("#formTrainFreqInput").val("");
}

trainDatabase.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDestination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequency);

    let trainName = childSnapshot.val().trainName;
    let destinationCity = childSnapshot.val().trainDestination;
    let firstTrain = childSnapshot.val().firstTrainTime;
    let timedFrequency = childSnapshot.val().frequency;

    let timeArr = firstTrain.split(":");
    let currentTimeForTrain = moment().hours(timeArr[0]).minutes(timeArr[1]);
    let maxTimeMoment = moment.max(moment(), currentTimeForTrain);
    let nextArrival;
    let timeDifference;

    if (maxTimeMoment === currentTimeForTrain) {
        nextArrival = currentTimeForTrain.format("hh:mm A");
        timeDifference = currentTimeForTrain.diff(moment(), "minutes");
    } else {
        // To calculate the minutes away till the next arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(currentTimeForTrain, "minutes");
        var reminder = differenceTimes % timedFrequency;
        timeDifference = timedFrequency - reminder;
        // To calculate the arrival time, add the tMinutes to the current time
        nextArrival = moment().add(timeDifference, "m").format("hh:mm A");
    }

    $("#trainTable > tbody").append(("<tr><td>" + trainName + "</td><td>" + destinationCity + "</td><td>" +
        timedFrequency + "</td><td>" + nextArrival + "</td><td>" + timeDifference + "</td></tr>"));
});

const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');
const setDate = () => {
    const currTime = moment().format('HH:mm:ss A');
    $('#myClock2').html(`<h1> ${currTime} </h1>`)

    const now = new Date();
    const seconds = now.getSeconds();
    const secondsDegrees = ((seconds / 60) * 360) + 90;
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

    const mins = now.getMinutes();
    const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
    minsHand.style.transform = `rotate(${minsDegrees}deg)`;

    const hour = now.getHours();
    const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;

}

setInterval(setDate, 1000);

setDate();