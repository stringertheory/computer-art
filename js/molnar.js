function calculate_hole_p (holes, x, y) {
  var result = 0;
  _.each(holes, function (hole) {
    var x_hole = hole[0];
    var y_hole = hole[1];
    var r_hole = hole[2];
    var r_squared = Math.pow(x - x_hole, 2) + Math.pow(y - y_hole, 2);
    result += (r_hole / r_squared);
  });
  return result;
}


function redraw_molnar () {
  var SVG_ID = '#molnar-canvas';
  var SIZE = 10;
  var N_X = 20;
  var N_Y = 20;
  var STROKE_WIDTH = 0.07;
  var N_HOLES = 12;
  var MIN_R = 1;
  var MAX_R = 5;
  
  var s = Snap(SVG_ID);
  s.clear();
  s.attr({
    viewBox: Snap.format('-1 -1 {max_x} {max_y}', {
      max_x: N_X + 2,
      max_y: N_Y + 2
    })
  });

  var holes = [];
  _.each(_.range(N_HOLES), function (i) {
    holes.push([
      Math.random() * N_X,
      Math.random() * N_Y,
      MIN_R + (MAX_R - MIN_R) * Math.random()
    ]);
  });
  console.log(holes);

  var rect_group = s.g();
  var line_group = s.g();
  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var p = calculate_hole_p(holes, x, y);
      var color = 255 - Math.min(255, 255 * p);
      // var rect = rect_group.add(s.rect(x - 1, y - 1, x + 1, y + 1).attr({
      // 	stroke: 'none',
      // 	fill: Snap.rgb(color, 255, 255)
      // }));
      if (Math.random() > p) {
	var line = s.line(x - 1, y, x + 1, y).attr({
	  stroke: 'black',
	  strokeWidth: STROKE_WIDTH
	});
	line.transform(
      	  Snap.format('r{angle},{x_center},{y_center}', {
      	    angle: 90 + (Math.random() - 0.5) * 135,
      	    x_center: x,
      	    y_center: y
      	  })
	);
      }
    });
  });
}
redraw_molnar();
