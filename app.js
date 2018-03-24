$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAUQYckh_cEHjx8jUoU-ERcqz8IEJ8NKhI",
        authDomain: "myfirstproject-b9662.firebaseapp.com",
        databaseURL: "https://myfirstproject-b9662.firebaseio.com",
        projectId: "myfirstproject-b9662",
        storageBucket: "myfirstproject-b9662.appspot.com",
        messagingSenderId: "746700287580"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    // Create a variable to reference the database.
    var database = firebase.database();


    $("#submit").on("click", function (event) {
        // prevent page from refreshing when form tries to submit itself

        event.preventDefault();

        // Capture user inputs and store them into variables
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var time = $("#time").val().trim();
        var frequency = $("#frequency").val().trim();
        var trains = new Array ();

        // Console log each of the user inputs to confirm we are receiving them
        console.log(name);
        console.log(destination);
        console.log(time);
        console.log(frequency);

        database.ref().push({
            name: name,
            destination: destination,
            time: time,
            frequency: frequency
        });
        database.ref().limitToLast(1).on("child_added", function(snapshot){
            console.log(snapshot.val());
            if (snapshot.child("name").exists() &&
                    snapshot.child("destination").exists() &&
                    snapshot.child("time").exists() &&
                    snapshot.child("frequency").exists())
            {

                var obj = {
                    name: snapshot.val().name,
                    destination: snapshot.val().destination,
                    time: snapshot.val().time,
                    frequency: snapshot.val().frequency
                };
                trains.push(obj);
                console.log('' + trains);
            }
        });
        for (var i = 0; i < trains.length; i++){

            console.log(trains[i]);

            $("tbody").append("<td>" + trains[i].name + "</td>");
            $("tbody").append("<td>" + trains[i].destination + "</td>");
            $("tbody").append("<td>" + trains[i].time + "</td>");
            $("tbody").append("<td>" + trains[i].frequency + "</td>");
        };
    });


});



