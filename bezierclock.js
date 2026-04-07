/*
- chmod lib\*.js
% xx xx xx -> xx:xx:xx

shift = f(place)

redraw only digits needed
if turn() for each place

figures set #2

mobile.version
  alllib/mylib.js
*/

/*
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
*/
/*
   var points = [
    [126, 197, 157, 74, 209, 75, 233, 194, 127, 195, 107, 337, 252, 319, 232, 194],
//1
    [172, 157, 193, 134, 181, 142, 205, 107, 207, 105, 213, 144, 171, 245, 170, 292],
//2    
    [120, 161, 120, 72, 267, 78, 237, 189, 237, 189, 208, 324, 11, 298, 236, 299],
//3 
    [152, 121, 252, 47, 243, 215, 184, 187, 182, 193, 259, 166, 284, 354, 130, 283],
//4
    [221, 106, 104, 246, 75, 221, 236, 240, 225, 105, 227, 191, 213, 212, 206, 295],   
//5
    [213, 104, 80, 102, 151, 126, 199, 154, 201, 155, 302, 203, 191, 370, 130, 263],
//6
    [231, 142, 218, 65, 144, 115, 131, 181, 131, 182, 64, 424, 388, 228, 152, 157],    
//7
    [127, 113, 266, 77, 250, 135, 215, 167, 215, 169, 157, 237, 156, 279, 162, 292],
//8
    [185, 175, 291, 75, 84, 73, 171, 176, 182, 176, 2, 343, 380, 331, 176, 180],
 //9 
    [204, 246, 4, 62, 299, 54, 224, 221, 226, 222, 178, 311, 169, 311, 133, 268],
    []
  ];
*/

window.onload = (function () {

  // var MYINDEX = 'myindex.htm';
  var MYWORKS = 'myworks.php'; 
  var MYDAILY = 'mydaily.htm';

  var DEBUG = 0;

  var dBegin = new Date();
  var dPause = null;
  var bPause = false;

  var CLOCKTITLE = 'TAB - clock vs timer, ENTER - my work';
  var TIMERTITLE = CLOCKTITLE + ', ESC - restart timer';
  
  var MYFORE = 'darkgray'; 
  if (DEBUG) 
    MYFORE = 'black'; 

  var MYBACK = 'white';
  var MYBLACK = 'black';
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

  var MAILHEIGHT = 20;

  var bInvert = false;
  var bBubble = false;
  var bTimer = false; //true;

  var par = location.search.substring(1);
  if (par == 'invert') 
    bInvert = true;
  if (par == 'bubble') 
    bBubble = true;
  if (par == 'timer') 
    bTimer = true;
  var oldtime;
  var newtime;

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
    for (var j = 0; j < 16; ++j) { //8
      points[i][j] += XSTART;
      points[i][++j] += YSTART;
    }

  var canvas = document.getElementById("canvas");
  canvas.width = width; 
  canvas.height = height - MAILHEIGHT;
 
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = MYTHIN; 
  ctx.strokeStyle = MYFORE;
  if (bInvert) {
//    ctx.strokeStyle = "white";
    ctx.fillStyle = MYBLACK; 
    ctx.fillRect(0, 0, width, height);
  }
  
  function mypause() {
      bPause = !bPause;
      if (bPause) {
        dPause = new Date();
        myalert(' pause on ');
      }
      if (!bPause) {
        dPause = new Date() - dPause;
        myloop();
        myalert(' pause off ');
      }
  }

  function step2() {
    myarc(100, 100, 26);
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
  
  function myarc(x, y, r) {
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
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

  function setmydelta(place) {
    var substep = SMOOTHES - smooth;
    var mydelta = new Array(16); //8
    for (var i = 0; i < 16; ++i) { //8
      mydelta[i] = 0;
      if ((smooth) && (turn[place]))
        mydelta[i] = delta[place][i] * substep;
    };
    return mydelta;
  }
  
  function digit(place, dig, xshift, show) {
    var x = (dig) ? dig : 0;
/*
    var substep = SMOOTHES - smooth;
    var mydelta = new Array(16); //8
    for (var i = 0; i < 16; ++i) { //8
      mydelta[i] = 0;
      if ((smooth) && (turn[place]))
        mydelta[i] = delta[place][i] * substep;
    }
*/
    var mydelta = setmydelta(place);
    ctx.moveTo(points[x][0] + xshift + mydelta[0], points[x][1] + mydelta[1]);
    ctx.bezierCurveTo(
      points[x][2] + xshift + mydelta[2], points[x][3] + mydelta[3], 
      points[x][4] + xshift + mydelta[4], points[x][5] + mydelta[5], 
      points[x][6] + xshift + mydelta[6], points[x][7] + mydelta[7]);
    ctx.moveTo(points[x][8] + xshift + mydelta[8], points[x][9] + mydelta[9]);
    ctx.bezierCurveTo(
      points[x][10] + xshift + mydelta[10], points[x][11] + mydelta[11], 
      points[x][12] + xshift + mydelta[12], points[x][13] + mydelta[13], 
      points[x][14] + xshift + mydelta[14], points[x][15] + mydelta[15]);
  }

  function drawCircle(p, r) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2*Math.PI);
    ctx.fill();
  }

  function bubble(place, dig, xshift, show) {
    var x = (dig) ? dig : 0;
    var mydelta = setmydelta(place);
    ctx.beginPath();  
    var curve; 
    curve = new Bezier(
      points[x][0] + xshift + mydelta[0], points[x][1] + mydelta[1],
      points[x][2] + xshift + mydelta[2], points[x][3] + mydelta[3], 
      points[x][4] + xshift + mydelta[4], points[x][5] + mydelta[5], 
      points[x][6] + xshift + mydelta[6], points[x][7] + mydelta[7]
      );
    var draw = function(curve) {
      var LUT = curve.getLUT(12); // number of bubbles
      if (show) {
        LUT.forEach(function(p) { drawCircle(p, 5); }); // 5
      }
      else {
        LUT.forEach(function(p) { drawCircle(p, 6); }); // 6
      }
    }
    draw(curve);
    curve = new Bezier(
      points[x][8] + xshift + mydelta[8], points[x][9] + mydelta[9],
      points[x][10] + xshift + mydelta[10], points[x][11] + mydelta[11], 
      points[x][12] + xshift + mydelta[12], points[x][13] + mydelta[13], 
      points[x][14] + xshift + mydelta[14], points[x][15] + mydelta[15]
      );

    draw(curve);
    ctx.stroke();
  }
  
  function mytime2str() {
    var d = new Date();
    var s = d.toTimeString();
    return s.substring(0, 2) + s.substring(3, 5) + s.substring(6, 8);
  }

  function mytimer2str() {
    var d, x;
    var dNow = new Date();
    if (dPause){
      dBegin.setTime(dBegin.getTime() + dPause);
      dPause = null;
    }
    var t = Math.round((dNow.getTime() - dBegin.getTime()) / 1000);
    d = t % 60;
    x = (d < 10) ? '0' + d : d;
    t = (t - d) / 60;
    d = t % 60;
    x = ((d < 10) ? ('0' + d) : d) + '' + x;
    t = (t - d) / 60;
    x = ((t < 10) ? ('0' + t) : t) + '' + x;
    return x;
  }
  
  function setDelta() {
    for (var i = 0; i < 6; ++i) {
      if (turn[i]) {
        var ON = oldtime.charAt(i); // oldN
        var NN = newtime.charAt(i); // newN
        for (var j = 0; j < 16; ++j) { // 8
          delta[i][j] = (points[NN][j] - points[ON][j]) / SMOOTHES;
        }
      }
    }
  }
  
  function step(show) {
    myshow(show); 
    ctx.beginPath();
    if (bBubble) {
      h0 = parseInt(oldtime.charAt(0));
      bubble(0, h0, DIGITWIDTH * 0, show);
      h1 = parseInt(oldtime.charAt(1));
      bubble(1, h1, DIGITWIDTH * 1, show);
      m0 = parseInt(oldtime.charAt(2));
      bubble(2, m0, DIGITWIDTH * 2 + POINTSWIDTH, show);
      m1 = parseInt(oldtime.charAt(3));
      bubble(3, m1, DIGITWIDTH * 3 + POINTSWIDTH, show);
      s0 = parseInt(oldtime.charAt(4));
      bubble(4, s0, DIGITWIDTH * 4 + POINTSWIDTH * 2, show);
      s1 = parseInt(oldtime.charAt(5));
      bubble(5, s1, DIGITWIDTH * 5 + POINTSWIDTH * 2, show);
      ctx.stroke();
    }
    else {
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
  }

  function shift() {
    oldtime = newtime;
    newtime = mytime2str();
    if (bTimer)
      newtime = mytimer2str();    
    if (bTimer)
      console.log(newtime);    
    for (var i = 0; i < 6; ++i) {
      turn[i] = (oldtime.charAt(i) == newtime.charAt(i)) ? 0 : 1;
    }
    smooth = SMOOTHES;
    setDelta();
  }
  
  document.onkeydown = function (e) {
    var c;
    var cESC = 27;
    var cENTER = 13;
    var cSPACE = 32;
    var cTAB = 9;

    if (e) {
      c = e.which;
    }
    else if (window.event) {
      c = window.event.keyCode;
    }
  /*
    if (c == cSPACE) {
      bPause = !bPause;
      if (bPause) {
        dPause = new Date();
        myalert(' pause on ');
      }
      if (!bPause) {
        dPause = new Date() - dPause;
        myloop();
        myalert(' pause off ');
      }
    }
    if (c == cESC) {
  */  
    if (c == cESC) {
      bTimer = !bTimer;
      if (bTimer) {
        dBegin = new Date();
      }
    }
    if (c == cENTER) {
      document.location.href = MYWORKS;
    }
    if (c == cTAB) {
      bTimer = !bTimer;
      if (bTimer) {
        dBegin = new Date();
//        canvas.title = TIMERTITLE;
      }
    }
  }
  // ...

  document.onkeypress = function(e) {
    var c;
    var cESC = 27;
    var cENTER = 13;
    var cSPACE = 32;
    var cTAB = 9;
    if (e) {
      c = e.which;
    }
    else if (window.event) {
      c = window.event.keyCode;
    }
    if (c == cENTER) 
      document.location.href = MYWORKS; 
  };

  document.oncontextmenu = function(e) {
    document.location.href = MYDAILY; 
    return false;
  };

  canvas.addEventListener('dblclick' , function(){ document.location.href = MYINDEX; } );

  oldtime = mytime2str();
  if (bTimer)
    oldtime = mytimer2str();    
  newtime = oldtime;

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

});
