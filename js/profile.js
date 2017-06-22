function square(angle) {
  return Math.min(1 / Math.abs(Math.cos(angle)), 1 / Math.abs(Math.sin(angle)));
}

function redrawProfile () {

  var SVG_ID = '#profile-canvas'
  var N_X = 4
  var N_Y = 4
  var N_POINTS = 40
  var N_OUTSIDE = 10
  var N_INSIDE = 10
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  var all_points = [];
  _.each(_.range(2 + N_OUTSIDE), function (i) {
    all_points.push([]);
  });
  _.each(_.range(2 + N_INSIDE), function (i) {
    all_points.push([]);
  });
  
  _.each(_.range(N_POINTS), function (i) {
    var angle = 2 * Math.PI * i / N_POINTS;

    var r_mid = square(angle) + 0.5 * Math.random();
    var x_mid = 2 + r_mid * Math.cos(angle);
    var y_mid = 2 + r_mid * Math.sin(angle);

    var r_out = square(angle)
    var x_out = 2 + 2 * r_out * Math.cos(angle);
    var y_out = 2 + 2 * r_out * Math.sin(angle);

    var r_in = square(angle)
    var x_in = 2 + 0.1 * r_in * Math.cos(angle);
    var y_in = 2 + 0.1 * r_in * Math.sin(angle);

    var index = 0;
    _.each(_.range(2 + N_OUTSIDE), function (j) {
      var f = j / (1 + N_OUTSIDE)
      var x = f * x_mid + (1 - f) * x_out
      var y = f * y_mid + (1 - f) * y_out
      console.log(i, angle, x_mid, x_out, y_mid, y_out, j, f, x, y)
      all_points[j].push([x, y]);
      index += 1;
    });
    _.each(_.range(2 + N_INSIDE), function (j) {
      var f = j / (1 + N_INSIDE)
      var x = f * x_mid + (1 - f) * x_in
      var y = f * y_mid + (1 - f) * y_in
      all_points[index + j].push([x, y]);
    });
  });
  _.each(all_points, function(points) {
    s.polygon(points).attr({
      stroke: 'black',
      fill: 'none',
      strokeWidth: 0.01,
    })
  });
  
}
redrawProfile()
