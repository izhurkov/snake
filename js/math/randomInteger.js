'use strict';

// возвращает случайное число в [min, max]
function randomInteger( min, max ) {
	var rand = min - 0.5 + Math.random() * (max - min + 1)
	rand = Math.round( rand );
	return rand;
};