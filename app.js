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

    var trains = [];

    function displayTable(ele) {
        appendTableColumn($('table'), ele);
    }

    function makeTable(container, data) {
        var table = $("table");
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
            });
            table.append(row);
        });
        return container.append(table);
    }

    function appendTableColumn(table, rowData) {
        var lastRow = $('<tr/>').appendTo(table.find('tbody:last'));
        $.each(rowData, function (colIndex, c) {
            lastRow.append($('<td/>').text(c));
        });

        return lastRow;
    }

    function retrieveTravels() {
        // debugger
        var rootRef = database.ref();
        var urlRef = rootRef.once("value", function(snapshot){
            snapshot.forEach(function (child) {
                var trainTable = makeTable($(document.table), 
                        [[child.val().name, child.val().destination, child.val().frequency, child.val().nextArrive, child.val().away]]);
                trains.push([child.val().name, child.val().destination, child.val().frequency, child.val().nextArrive, child.val().away]);
            });
        });
    }

    function databasePush(name, destination, frequency, nextArrive, away) {
        database.ref().push({
            name: name,
            destination: destination,
            frequency: frequency,
            nextArrive: nextArrive,
            away: away
        });
    }
    
    $("#submit").on("click", function (event) {
        // prevent page from refreshing when form tries to submit itself
        // debugger
        event.preventDefault();
        
        // Capture user inputs and store them into variables

        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();

        var firstTime = moment($("#firstTime").val().trim(), "hh:mm A").format("LT");
        var frequency = moment($("#frequency").val().trim(), "m").format("m");

        var nextArrive = "3:00 PM";
        var away = "2";
    // nextArrive = moment(firstTime).add(frequency, 'hh:mm A').format("HH:mm A");
    // away = moment(nextArrive).diff(firstTime, 'HH');

        databasePush(name, destination, frequency, nextArrive, away);
        var obj;
        database.ref().limitToLast(1).on("child_added", function(snapshot){
            console.log(snapshot.val());
            if (snapshot.child("name").exists() &&
                    snapshot.child("destination").exists() &&
                    snapshot.child("frequency").exists() &&
                    snapshot.child("nextArrive").exists() &&
                    snapshot.child("away").exists())
            {

                obj = [
                    snapshot.val().name,
                    snapshot.val().destination,
                    snapshot.val().frequency,
                    snapshot.val().nextArrive,
                    snapshot.val().away
                ]
                trains.push(obj);
            }
        });
        displayTable(obj);
    });

    retrieveTravels();

});



