// function divEscapedContentElement(message) {
// 	return $('<div></div>').text(message);
// }

// function divSystemContentElement(message) {
// 	return $('<div></div>').html('<i>' + message  + '</i>');
// }

var tasks = {};
function processUserInput(chatApp, socket)
{
    var message = $("#someitemtext").val();
    if(!(message in tasks)&&message!="") {
    var prior = $("#priority");
    // var systemMessage;
    var adding = 0;
    if (prior.val() == "High")
    {
    	//console.log("this one");
    	adding = $('<div></div>').html('<div style="color:red" id="input"><input type="checkbox" name="item" class="item" value="' + message + '" /> '+ message +'</div>');
        $('#high').append(adding);
    }
    if (prior.val() == "Medium")
    {
    	adding = $('<div></div>').html('<div style="color:orange" id="input"><input type="checkbox" name="item" class="item" value="' + message + '" /> '+ message +'</div>');
    	$('#medium').append(adding);
    }
    if (prior.val() == "Low")
    {
    	adding = $('<div></div>').html ('<div style="color:black" id="input"><input type="checkbox" name="item" class="item" value="' + message + '" /> '+ message +'</div>');
        $('#low').append(adding);
    }
    if(!(message in tasks))
    tasks[message] =adding;
    chatApp.sendMessage($('room').text(), message, prior.val());
  	//chatApp.sendMessage($('room').text(), message);
 //    if (message.charAt(0) == '/') {
	// systemMessage = chatApp.processCommand(message);
	// if (systemMessage) {
	//     $('#messages').append(divSystemContentElement(systemMessage));
	// }
	
 //    } else {
	// chatApp.sendMessage($('room').text(), message);
	// $('#messages').append(divEscapedContentElement(message));
	// // $('#messages').scrollTop('#messages'.prop('scrollHeight'));
 //    }
    }
    else
    	console.log("can't have a task that was used before");
    $('#someitemtext').val('');

}

var socket = io.connect();

$(document).ready( function ()
{
    var chatApp = new Chat(socket);
    
    //socket.on('nameResult', function(result) {
	//var message;
		
	//if (result.success) {
	//    message = 'You are now known as ' + result.name + '.';
	    
	//} else {
	//    message = result.message;
	//}
	
	//$('#messages').append(divSystemContentElement(message));
	
    //});
    
 //    socket.on('joinResult', function(result) {
	// $('#room').text(result.room);
	// $('#messages').append(divSystemContentElement('Room changed.'));
 //    });
	$("#someitemtext").on("keyup", function(event) {
		if (event.which == 13)
		{
			processUserInput(chatApp, socket);
		}
	});
    $(":button").on("click", function() {
		processUserInput(chatApp, socket);
    });
    socket.on('message', function(message) {
		//var newElement = $('<div></div>').text(message.text);
		if(!(message.val in tasks)&&message.val != "" ) {
		var adding = 0;
		if (message.prior == "High")
		{
			adding = $('<div></div>').html('<div style="color:red" id="input"><input type="checkbox" name="item" class="item" value="' + message.val + '" /> '+ message.val +'</div>');
			$("#high").append(adding);
		}
		if (message.prior == "Medium")
		{
			adding = $('<div></div>').html('<div style="color:orange" id="input"><input type="checkbox" name="item" class="item" value="' + message.val + '" /> '+ message.val +'</div>');
			$('#medium').append(adding);
		}
		if (message.prior == "Low")
		{
			adding = $('<div></div>').html('<div style="color:black" id="input"><input type="checkbox" name="item" class="item" value="' + message.val + '" /> '+ message.val +'</div>');
			$('#low').append(adding);
    	}
    	tasks[message.val] = adding;
    	}
    });
    $(document).on('change', '.item', function() {
        if( $(this).is(':checked') ){
        	//var index = tasks.indexof($(this));
            chatApp.removeTask($('room').text(), $(this).val());
            var parentElem = $(this).parent();
            //console.log(parentElem.class());
            parentElem.remove();
        }
    });
    socket.on('remove', function (item) {
    	if(item in tasks){
    		//var name = "#"+ item;
    		tasks[item].remove();
    		//var high = document.getElementById("high");
    		//high.removeChild(tasks[item]);
    		//$("#medium").removeChild(tasks[item]);
    		//$("#low").removeChild(tasks[item]);
    		//tasks[item].parent().removeChild(tasks[item]);
    	}
    })
 //    socket.on('rooms', function(rooms) {
	// $('#room-list').empty();
	
	// for (var room in rooms) {
	//     room = room.substring(1, room.length);
	//     if (room != '') {
	// 	$('#room-list').append(divEscapedContentElement(room));
	//     }
	// }
	
	// $('#room-list div').click(function () {
	//     chatApp.processCommand('/join ' + $(this).text());
	//     $('#send-message').focus();
	// })
	
 //    });
    
    
    setInterval(function () {
	socket.emit('rooms');
    }, 1000);
    
    //$('#send-message').focus();
    
    
    
});
