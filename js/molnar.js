function calculateHoleP (holes, x, y) {
  var result = 0
  _.each(holes, function (hole) {
    var x_hole = hole[0]
    var y_hole = hole[1]
    var r_hole = hole[2]
    var r_squared = Math.pow(x - x_hole, 2) + Math.pow(y - y_hole, 2)
    result += (r_hole / r_squared)
  })
  return result
}

function redrawMolnar () {
  var SVG_ID = '#molnar-canvas'
  var N_X = 50
  var N_Y = 50
  var STROKE_WIDTH = 0.07
  var N_HOLES = 12
  var MIN_R = 1
  var MAX_R = 5

  var s = makeSVG(SVG_ID, N_X, N_Y)

  var holes = []
  _.each(_.range(N_HOLES), function (i) {
    holes.push([
      Math.random() * N_X,
      Math.random() * N_Y,
      MIN_R + (MAX_R - MIN_R) * Math.random()
    ])
  })

  var rect_group = s.g()
  var line_group = s.g()
  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var p = calculateHoleP(holes, x, y)
      var color = 255 - Math.min(255, 255 * p)
      // var rect = rect_group.add(s.rect(x - 1, y - 1, x + 1, y + 1).attr({
      // 	stroke: 'none',
      // 	fill: Snap.rgb(color, 255, 255)
      // }));
      if (Math.random() > p) {
	                                                                                var line = s.line(x - 0.5, y + 0.5, x + 1.5, y + 0.5).attr({
	                      stroke: 'black',
	                      strokeWidth: STROKE_WIDTH
	})
	                                                                                line.transform(
      	  Snap.format('r{angle},{x_center},{y_center}', {
      	                        angle: 90 + (Math.random() - 0.5) * 135,
	    // angle: 0,
      	                        x_center: x + 0.5,
      	                        y_center: y + 0.5
      	  })
	)
      }
    })
  })
}
redrawMolnar()
