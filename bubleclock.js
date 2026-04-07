/*


+ smooth substeps
+ js
+ photo #3
- chmod lib\*.js
+ center 
% xx xx xx -> xx:xx:xx

shift = f(place)

redraw only digits needed
if turn() for each place

figures set #2

drawing tool

mobile.version
  size
  position from left
  alllib/mylib.js

*/


window.onload = (function () {

  var DEBUG = 0;
  
  var points = [
    [200, 299, 394, 36, 9, 40, 194, 301],
    [200, 299, 255, 32, 205, 70, 200, 120],
    [231, 301, 6, 340, 390, 52, 156, 100],
    [204, 145, 149, 270, 129, 170, 210, 246],   // ????
    [199, 100, 25, 312, 214, 72, 200, 299],
    [223, 100, 30, 100, 377, 165, 175, 298],
    [199, 101, 12, 357, 378, 356, 169, 173],
    [130, 100, 353, 71, 183, 164, 173, 300],
    [132, 255, 365, 43, 22, 40, 245, 255],
    [182, 304, 365, 43, 9, 40, 214, 219]
  ];

  var MYFORE = "darkgray"; 
  if (DEBUG) 
    MYFORE = "black"; 

  var MYBACK = "white";
  var MYBLACK = "black";
  var MYTHIN = 2;
  var MYTHICK = 4;
  var SHIFT = 20;    
  var XSTART = -180;  // DEBUG -> 0
  var YSTART = -80;  // DEBUG -> 0
  var DIGITWIDTH = 100;
  var POINTSWIDTH = 50;
  var SECOND = 1000;

  var SMOOTHES = 10;

//  var MYX = 180, Y = 90, 
  var MYWIDTH = 670, MYHEIGHT = 220;

  var par = location.search.substring(1);
  var bInvert = false;
  if (par == 'invert') 
    bInvert = true;
  var oldtime = mytime2str();
  var newtime = oldtime;
  var smooth = SMOOTHES;

//  var turn = new Array(6);
  var turn = new Array(1, 1, 1, 1, 1, 1);
  var delta = new Array(6);
  for (var i = 0; i < 6; ++i) 
    delta[i] = new Array(8);

  var width = (window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth) - SHIFT;

  var height = (window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight) - SHIFT;  

  var dwidth = width - MYWIDTH;
  var dheight = height - MYHEIGHT;
  if (dwidth > 0) 
    XSTART += dwidth / 2;
  if (dheight > 0)
    YSTART += dheight / 2;
  
  for (var i = 0; i < 10; ++i) 
    for (var j = 0; j < 8; ++j) {
      points[i][j] += XSTART;
      points[i][++j] += YSTART;
    }

//    canvas = $("#canvas")[0];
  var canvas = document.getElementById("canvas");
  canvas.width = width; 
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = MYTHIN; 
  ctx.strokeStyle = MYFORE;
  if (bInvert) {
//    ctx.strokeStyle = "white";
    ctx.fillStyle = MYBLACK; 
    ctx.fillRect(0, 0, width, height);
  }
  
  function mypoints() {
    var XPOINTSHIFT = 140, YPOINTSHIFT = 90;
    myarc(XPOINTSHIFT + XSTART + (DIGITWIDTH * 2) + (POINTSWIDTH / 2), YPOINTSHIFT + YSTART + (MYHEIGHT / 3), 2);
    myarc(XPOINTSHIFT + XSTART + DIGITWIDTH * 2 + POINTSWIDTH / 2, YPOINTSHIFT + YSTART + MYHEIGHT * 2 / 3, 2);
    myarc(XPOINTSHIFT + XSTART + (DIGITWIDTH * 4) + (POINTSWIDTH * 3 / 2), YPOINTSHIFT + YSTART + (MYHEIGHT / 3), 2);
    myarc(XPOINTSHIFT + XSTART + DIGITWIDTH * 4 + POINTSWIDTH * 3 / 2, YPOINTSHIFT + YSTART + MYHEIGHT * 2 / 3, 2);
  }

  function myshow(show) {
    if (show) {
      ctx.strokeStyle = MYFORE;
      ctx.fillStyle = MYFORE;
      ctx.lineWidth = MYTHIN;
    }
    else {
      ctx.strokeStyle = MYBACK;
      ctx.fillStyle = MYBACK; 
      ctx.lineWidth = MYTHICK;
    }
  }

  function step(show) {
    myshow(show); 
    ctx.beginPath();
    h0 = parseInt(oldtime.charAt(0));
    digit(0, h0, DIGITWIDTH * 0, show);
    h1 = parseInt(oldtime.charAt(1));
    digit(1, h1, DIGITWIDTH * 1, show);
    m0 = parseInt(oldtime.charAt(2));
    digit(2, m0, DIGITWIDTH * 2 + POINTSWIDTH, show);
    m1 = parseInt(oldtime.charAt(3));
    digit(3, m1, DIGITWIDTH * 3 + POINTSWIDTH, show);
    s0 = parseInt(oldtime.charAt(4));
    digit(4, s0, DIGITWIDTH * 4 + POINTSWIDTH * 2, show);
    s1 = parseInt(oldtime.charAt(5));
    digit(5, s1, DIGITWIDTH * 5 + POINTSWIDTH * 2, show);
    ctx.stroke();
  }

  function drawCircle(p, r) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2*Math.PI);
    ctx.fill();
  }

  function digit(place, dig, xshift, show) {
    var x = (dig) ? dig : 0;
    var substep = SMOOTHES - smooth;
    var mydelta = new Array(8);
    for (var i = 0; i < 8; ++i) {
      mydelta[i] = 0;
      if ((smooth) && (turn[place]))
        mydelta[i] = delta[place][i] * substep;
    }
//// ???
    ctx.beginPath();
    
    var curve = new Bezier(
      points[x][0] + xshift + mydelta[0], points[x][1] + mydelta[1],
      points[x][2] + xshift + mydelta[2], points[x][3] + mydelta[3], 
      points[x][4] + xshift + mydelta[4], points[x][5] + mydelta[5], 
      points[x][6] + xshift + mydelta[6], points[x][7] + mydelta[7]
      );
    var draw = function() {
      var LUT = curve.getLUT(16);
      if (show) {
        LUT.forEach(function(p) { drawCircle(p, 5); });
      }
      else {
        LUT.forEach(function(p) { drawCircle(p, 6); });
      }
    }
    draw();
    ctx.stroke();
  }

  
  function shift() {
    oldtime = newtime;
    newtime = mytime2str();
    for (var i = 0; i < 6; ++i) {
      turn[i] = (oldtime.charAt(i) == newtime.charAt(i)) ? 0 : 1;
    }
    smooth = SMOOTHES;
    setDelta();
  }

  function mytime2str() {
    var d = new Date();
    var s = d.toTimeString();
    return s.substring(0, 2) + s.substring(3, 5) + s.substring(6, 8);
  }
  
  function setDelta() {
    for (var i = 0; i < 6; ++i) {
      if (turn[i]) {
        var ON = oldtime.charAt(i); // oldN
        var NN = newtime.charAt(i); // newN
        for (var j = 0; j < 8; ++j) {
          delta[i][j] = (points[NN][j] - points[ON][j]) / SMOOTHES;
        }
      }
    }
  }
  
//  mypoints();
//  for (var i = 0; i < 8; ++i) {    turn[i] = 1;  }
//  step(1);

  setInterval(function() {
    step(0);
    if (--smooth) {
//      mynote(oldtime + ' ' + newtime + ' ' + turn, smooth);
    }
    else {
      shift();
    }
    step(1);
    if (DEBUG) mytest();
  }, (SECOND / SMOOTHES));

  function step2() {
    myarc(100, 100, 26);
  }
  function myarc(x, y, r) {
//    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
//    ctx.stroke();
  }
  function mytest() {
    var X = 180, Y = 90, W = 670, H = 220;
    ctx.strokeStyle = "lightgray";
    ctx.strokeRect(X + XSTART, Y + YSTART, W, H);
  }
  function mynote(t, tt) {
    var X = 200, Y = 600, W = 600, H = 100, D = 10;
    ctx.strokeStyle = MYFORE;
    ctx.fillStyle = MYBACK; 
    ctx.fillRect(X, Y, W, H);
    ctx.lineWidth = 1; 
    ctx.strokeText(t, X, Y + D);
    if (tt)
      ctx.strokeText(tt, X, Y + D * 3);
  }

});
