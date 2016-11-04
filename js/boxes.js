function drawGroup(s, x, y, w, color) {
  var n_squares = _.random(5, 12);
  var x_center = 0.5 + 0.6 * (Math.random() - 0.5);
  var y_center = 0.5 + 0.6 * (Math.random() - 0.5);
  var i_size = 0.1;// + 0.15 * Math.random();
  var f_size = 0.9;
  var x_step = (x_center - i_size / 2) / (n_squares - 1);
  var y_step = (y_center - i_size / 2) / (n_squares - 1);
  console.log(x_center, y_center, x_step, y_step, i_size);
  _.each(_.range(n_squares), function (z) {
    var size = 0.9 * (i_size + (1 - i_size) * (z / (n_squares - 1)));
    var c_x = 0.05 + x + (n_squares - 1 - z) * x_step;
    var c_y = 0.05 + y + (n_squares - 1 - z) * y_step;
    console.log(z, c_x, c_y, size);
    var r = s.rect(c_x, c_y, size, size).attr({
      stroke: color,
      strokeWidth: w,
      fill: 'none'
    })
  })
}

function redrawBoxes () {
  var SVG_ID = '#boxes-canvas'
  var N_X = 4
  var N_Y = 4
  var STROKE_WIDTH = 0.01

  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var color = Snap.rgb(255, Math.random() * 255, 0, 0.5);
      drawGroup(s, x, y, STROKE_WIDTH * 3, color);
      var color = Snap.rgb(0, Math.random(), Math.random() * 255, 0.5);
      drawGroup(s, x, y, STROKE_WIDTH * 1.5, color);
    })
  })
}
redrawBoxes()
