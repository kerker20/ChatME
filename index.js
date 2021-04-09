console.log("index.js");

// var client  = mqtt.connect({ host:'test.mosquitto.org', port: 8081})
// or
var dt = new Date();
var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();


var client = mqtt.connect('wss://test.mosquitto.org:8081/mqtt')

var pubTopic = document.getElementById('topic')
var message = document.getElementById('payload')
var messageType = document.getElementById('msgs')

var d = new Date();

var Topic = document.getElementById('topic').value;
var Payload = document.getElementById('payload').value;

var div = $('#messages'),
    height = div.height();
client.on('message', function(Topic, Payload) {
    $('#displayMsg').hide()
    $('#messages').show()
    $('#typing').show()
    if (Topic != pubTopic.value) {
        $("#messages").append("<img id='ava1' class='ui' src='avatar.png' alt='' style='border-radius:50%; float:right;width:40px;'><br><p  id='mymsg' class='alert alert ml-5 mt-4' style='text-align:right;width: 200px;border-radius: 30px 30px 30px;background-color:#626a73;color:white;' id='you' role='alert'>" + Payload + "<br><span style='margin-top:1px;float:right;' id='msg2'>" + Topic + "&nbsp;" + time + "</span></p>")
        div.animate({ scrollTop: height }, 500);
        height += div.height();
        // scroll_to_bottom($('#messages'));
    } else {
        div.append("<p class='chat-logs mt-3'><img id='ava2' class='ui' src='avatar2.png' alt='' style='border-radius:50%; float:left;width:40px;'><br><p id='mymsg' class='alert alert mt-4' role='alert' style='width:200px;border-radius: 30px 30px 30px;background-color:#4690e3;color:white;'>" + Payload + "<br><span style='margin-top:1px;float:left;' id='msg1'>You &nbsp;" + time + "</p></p>")
        div.animate({ scrollTop: height }, 1000);
        height += div.height();

    }
    // $("#tableMessages tbody").prepend("<tr id='msg'><td>" + Topic + "</td><td>" + Payload + "</td><td>" + d.toUTCString() + "</td></tr>")
})

$(document).ready(function() {
    $('#connect').click(function() {
        $('#status').val("Connecting...").css("color", "green")
        client.on('connect', function() {
            $('#status').val("Connected Successfully!")
        })

        // if key Enter is pressed!

        $('#msgs').keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                if ($('#msgs').val() != "") {
                    client.publish(pubTopic.value, messageType.value)
                    $('#msgs').val('')
                } else {
                    $('#errMsg').show().fadeOut(2000)
                }
            }
        });


        $('#published').click(function() {
            if (pubTopic.value != '' && message.value != '') {
                client.publish(pubTopic.value, message.value)
                $('#displayPub').hide()
                $("#tablePub tbody").prepend("<tr id='pub'><td>" + pubTopic.value + "</td><td>" + message.value + "</td><td>" + d.toUTCString() + "</td></tr>")
            } else {
                $('#errPub').show().fadeOut(2000)
            }
        })


        // if key Enter is pressed!

        $('#subtopic').keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                client.subscribe(subtopic.value)
                $('#display').hide()
                $("#tableSub tbody").prepend("<tr id='sub'><td>" + subtopic.value + "</td><td>" + d.toUTCString() + "</td></tr>")
            }
        });

        $('#subscribe').click(function() {
            if (subtopic.value != '') {
                client.subscribe(subtopic.value)
                $('#display').hide()
                $("#tableSub tbody").prepend("<tr id='sub'><td>" + subtopic.value + "</td><td>" + d.toUTCString() + "</td></tr>")
            } else {
                $('#errSub').show().fadeOut(2000)
            }
        })
        $('#clearPub').click(function() {
            $('#pub td').fadeOut("slow")
        })
        $('#clearSub').click(function() {
            $('#sub td').fadeOut("slow")
        })
        $('#clearMsg').click(function() {
            $('#mymsg') && $('#messages').empty()
            $('#typing').hide()
        })
        $('#unsubscribe').click(function() {
            var check = $('#tableSub tbody tr').children().length
            var tables = $('#tableSub tbody tr').children()
            if (check < 1) {
                $('#errUnSub').show().fadeOut(2000)
            } else {
                $(tables).each(function(index, value) {
                    if ($(value).text() == $('#subtopic').val()) {
                        $(value).parent().remove();
                        client.unsubscribe($('#subtopic').val())
                    }
                })
            }
        })
    })
    $('#disconnect').click(function() {
        $('#status').val("Disconnected!").css("color", "red")
        client = "";
    })

})