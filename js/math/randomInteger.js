'use strict';

function randomInteger( min, max ) {
	var rand = min - 0.5 + Math.random() * (max - min + 1)
	rand = Math.round( rand );
	return rand;
};

function getRandomHexColor( preColor ) {
  var letters = '012345ABCDEF';
  var color = preColor;
  for (var i = 0; i < 6; i++) {
  	// console.log(letters[randomInteger(0, 2)]);
    color += letters[randomInteger(0, letters.length - 1)];
  }
  return color;
}