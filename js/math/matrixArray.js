'use strict';

function matrixArray( rows, columns ){
  var arr = new Array();
  for( var i = 0; i < rows; i++ ){
    arr[i] = new Array();
    for( var j = 0; j < columns; j++ ){
      arr[i][j] = 0;
    }
  }
  return arr;
}