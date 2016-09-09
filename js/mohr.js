function redraw_mohr () {
  var SVG_ID = '#mohr-canvas';
  var N_X = 8;
  var N_Y = 8;
  var STROKE_WIDTH = 0.02;
  var PAD = 0.2;
  var R = 0.15;
  var BACK = 255;
  var FORE = 0;
  var OPACITY = 0.9;
  var ANGLES = _.map([
       0,
      45,   45,   45,   45,
     -45,  -45,  -45,  -45,
      90,   90,
     -90,  -90,
     135,
    -135
  ], function (degrees) {
    return degrees * (Math.PI / 180);
  });
  
  var s = Snap(SVG_ID);
  s.clear();
  s.attr({
    viewBox: Snap.format('-1 -1 {max_x} {max_y}', {
      max_x: N_X + 2,
      max_y: N_Y + 2
    })
  });
  s.rect(-1, -1, N_X + 2, N_Y + 2).attr({
    fill: Snap.rgb(BACK, BACK, BACK),
    stroke: 'none',
    fillOpacity: OPACITY
  });
  _.each(_.range(N_Y), function (y_i) {
    var x = 0;
    var y = y_i + 0.5;
    var width = STROKE_WIDTH * _.sample([1, 1, 1, 2, 2, 3]);
    var points = [];
    var angle = 0;
    var x_ok = false;
    while (!(x_ok)) {
      var y_ok = false;
      while (!(y_ok)) {
	var angle_try = _.sample(ANGLES);
	var r = R * (1 + Math.random())
	var x_try = x + r * Math.cos(angle_try);
	var y_try = y + r * Math.sin(angle_try);
	var same = Math.abs(angle - angle_try) === 0;
	if (!(same)) {
	  width = STROKE_WIDTH * _.sample([1, 1, 1, 2, 2, 3]);
	}
	var opposite = Math.abs(angle - angle_try) === Math.PI;
	y_ok = (!(opposite) && y_try >= (y_i + PAD) && y_try <= (y_i + 1 - PAD));
      }
      points.push({
	x1: x,
	y1: y,
	x2: x_try,
	y2: y_try,
	width: width
      });
      x = x_try;
      y = y_try;
      angle = angle_try;
      x_ok = (x >= N_X);
    };
    _.each(points, function (p) {
      var line = s.line(p.x1, p.y1, p.x2, p.y2).attr({
	stroke: Snap.rgb(FORE, FORE, FORE),
	strokeWidth: p.width,
	strokeOpacity: OPACITY,
	fill: 'none'
      });
    });
  });
}
redraw_mohr();
