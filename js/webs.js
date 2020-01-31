import {makeSVG} from './utils.js';

function drawOne(s, x, y) {
  // var r = s.rect(x, y, 1, 1).attr({
  //   stroke: 'black',
  //   strokeWidth: 0.01,
  //   // fill: 'none'
  // })
  var n_lines = 15;
  _.each(_.range(n_lines - 0), function (i) {
    var color = chroma.random().hex();
    var rscale = 4.0;
    var line = s.line(x + (i + rscale * Math.random())/n_lines, y, x + 1, y + (i + rscale * Math.random())/n_lines).attr({
      stroke: color,
      strokeWidth: 0.01,
    })
    var line = s.line(x + 1, y + (i + rscale * Math.random())/n_lines, x + 1 - (i + rscale * Math.random())/n_lines, y + 1).attr({
      stroke: color,
      strokeWidth: 0.01,
    })
    var line = s.line(x + 1 - (i + rscale * Math.random())/n_lines, y + 1, x, y + 1 - (i + rscale * Math.random())/n_lines).attr({
      stroke: color,
      strokeWidth: 0.01,
    })
    var line = s.line(x, y + 1 - (i + rscale * Math.random())/n_lines, x + (i + rscale * Math.random())/n_lines, y).attr({
      // stroke: Snap.rgb(0, 0, 0),
      stroke: color,
      strokeWidth: 0.01,
    })
    // var line = s.line(x + i/n_lines, y + 1, x + 1, y + 1 - i/n_lines).attr({
    //   stroke: Snap.rgb(0, 0, 0),
    //   strokeWidth: 0.01,
    // })
  })
}

function regenerate () {
  var SVG_ID = '#canvas'
  var N_X = 7
  var N_Y = 7
  var STROKE_WIDTH = 0.01

  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      drawOne(s, x, y);
    })
  })
}
