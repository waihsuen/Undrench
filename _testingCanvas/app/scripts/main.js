console.log('\'Allo \'Allo!');


$(document).ready(function() {
	// 14 BY 14
	// EVERY BOX IS 27 X 27

	var c = document.getElementById('myCanvas');
	var ctx = c.getContext('2d');


	function getRndColor() {
		var temp = Math.floor(Math.random() * 6) + 1;
		//console.log(temp);
		// GREEN PINK PURPLE LIGHTGREEN RED YELLOW
		switch(temp) {
			case 1 :
				return '#66cc00'; // return green 
			break;
			case 2 :
				return '#ff9fff'; // return lite purple/pink 
			break;
			case 3 :
				return '#743ef4'; // return purple 
			break;
			case 4 :
				return '#ccffcc'; // return lite green 
			break;
			case 5 :
				return '#ff0000'; // return red 
			break;
			case 6 :
				return '#ffcc00'; // return yellow 
			break;
			default :
				return '#000000'; // return DEFAULT WHICH IS ERROR
			break;
		}
		// var r = 255*Math.random()|0,
		// g = 255*Math.random()|0,
		// b = 255*Math.random()|0;
		// return 'rgb(' + r + ',' + g + ',' + b + ')';
	}

	var gridCellSize = 27; // DEFAULT 27
	var gridSize = 14; // DEFAULT 14

	for (var i=0; i < gridSize; i++) {
		for (var j=0; j < gridSize; j++) {
			ctx.fillStyle = getRndColor();
			
			if (i === 0 && j < 4) {
				ctx.fillStyle = '#66cc00';
			}
			if (i === 1 && j < 2) {
				ctx.fillStyle = '#66cc00';
			}
			if (i === 2 && j < 2) {
				ctx.fillStyle = '#66cc00';
			}
			if (i === 3 && j < 2) {
				ctx.fillStyle = '#66cc00';
			}

			if (i === 0 && j === 4) {
				ctx.fillStyle = '#ff0000';
			}
			if (i === 0 && j === 5) {
				ctx.fillStyle = '#ff0000';
			}

			ctx.beginPath();
			ctx.fillRect((i*gridCellSize), (j*gridCellSize), gridCellSize, gridCellSize);
		}
	}


	// ctx.fillStyle = 'lightgrey';
	// ctx.beginPath();
	// ctx.fillRect(0, 0, 150, 150);
	// ctx.fill();

});


