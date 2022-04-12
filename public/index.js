timeLeft = 120;

function countdown() {
	timeLeft--;
	document.getElementById("seconds").innerHTML = String( timeLeft );
	if (timeLeft > 0) {
		setTimeout(countdown, 1000);
	}
  if(timeLeft === 0){
    window.location.assign("http://pass.b2bdev.net/"); 
  }
};

setTimeout(countdown, 1000);
