function redraw_nees () {
  var SVG_ID = '#nees-canvas';
  var SIZE = 10;
  var N_X = 12;
  var N_Y = 24;
  var STROKE_WIDTH = 0.05;

  var s = Snap(SVG_ID);
  s.clear();
  s.attr({
    viewBox: Snap.format('-1 -1 {max_x} {max_y}', {
      max_x: N_X + 2,
      max_y: N_Y + 2
    })
  });

  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var r = s.rect(x, y, 1, 1).attr({
	stroke: 'black',
	strokeWidth: STROKE_WIDTH,
	fill: 'none'
      });
      r.transform(
      	Snap.format('r{angle},{x_center},{y_center}', {
      	  angle: (y / N_Y) * 90 * (Math.random() - 0.5),
      	  x_center: x,
      	  y_center: y
      	})
      );
    });
  });
}
redraw_nees();
