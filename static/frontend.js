// when pressing enter in searchbox
$("#eq").on('keyup', function (e) {
	if (e.keyCode == 13) {
		sendEQ();
	}
});

// when search button is clicked, send a request to spotify
$('#submit').click(sendEQ);

function sendEQ(){
	console.log('sending equation to sv');
}