function blob(x_center, y_center, r_base, n_points) {
  var jitter = 0.05
  noise.seed(Math.random());
  var x_squish = 1//0.5 + 0.5 * (Math.random() - 0.5)
  var y_squish = 1//0.5 + 0.5 * (Math.random() - 0.5)
  var points = []
  _.each(_.range(n_points), function (i) {
    var theta = 2 * Math.PI * i / n_points
    var x = Math.cos(theta)
    var y = Math.sin(theta)
    var r = r_base + jitter * noise.perlin2(x, y)
    var x = x_squish * r * Math.cos(theta)
    var y = y_squish * r * Math.sin(theta)
    points.push([x_center + x, y_center + y])
  })
  points.push([points[0][0], points[0][1]])
  return points  
}

function redrawNoiseTest () {
  var SVG_ID = '#noisetest-canvas'
  var N_X = 5
  var N_Y = 5
  var N_POINTS = 100
  var STROKE_WIDTH = 0.02;
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var points = blob(x + 0.5, y + 0.5, 0.4, 100);
      var face = s.polyline(points).attr({
        stroke: 'black',
        strokeWidth: STROKE_WIDTH,
        fill: 'none',
      })
      var points = [[x + 0.05, y + 0.5], [x + 1 - 0.05, y + 0.5]]
      var mouth = s.polyline(points).attr({
        stroke: 'black',
        strokeWidth: STROKE_WIDTH,
        fill: 'none',
      })
      var n_legs = 2
      _.each(_.range(n_legs), function (i) {
        var theta = Math.PI / 2 - 15 * Math.PI / 180 + 30 * i * Math.PI / 180
        var points = [
          [x + 0.5 + 0.3 * Math.cos(theta), y + 0.5 + 0.3 * Math.sin(theta)],
          [x + 0.5 + 0.5 * Math.cos(theta), y + 0.5 + 0.5 * Math.sin(theta)],
        ]
        var leg = s.polyline(points).attr({
          stroke: 'black',
          strokeWidth: STROKE_WIDTH,
          fill: 'none',
        })
        
      })

      var n_eyes = 2
      _.each(_.range(n_eyes), function (i) {
        var theta = 3 * Math.PI / 2 - 15 * Math.PI / 180 + 30 * i * Math.PI / 180
        var r = 0.2
        var x_eye = r * Math.cos(theta)
        var y_eye = r * Math.sin(theta)
        var leg = s.circle(x + 0.5 + x_eye, y + 0.5 + y_eye, 0.02).attr({
          stroke: 'none',
          strokeWidth: STROKE_WIDTH,
          fill: 'black',
        })
        
      })
        // p.transform(Snap.format('r{angle},{x_center},{y_center}', {
      // 	angle: Math.random() * 360,
      // 	x_center: x + 0.5,
      // 	y_center: y + 0.5
      // }))
    })
  })
  
  
}
redrawNoiseTest()
