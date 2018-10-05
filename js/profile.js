import {makeSVG} from './utils.js';
import {noise} from './perlin.js';

import FACE from './face.json';

function ngon(angle, n, rotation=0) {
  return Math.cos(Math.PI / n) / Math.cos(((angle + rotation) % (2 * Math.PI / n)) - (Math.PI / n));
}

function square(angle) {
  return Math.min(1 / Math.abs(Math.cos(angle)), 1 / Math.abs(Math.sin(angle)));
}

export default function redraw () {

  var SVG_ID = '#canvas'
  var N_X = 4
  var N_Y = 4
  var N_POINTS = FACE.length;
  var N_OUTSIDE = 7
  var N_INSIDE = 11
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  var all_points = [];
  _.each(_.range(2 + N_OUTSIDE), function (i) {
    all_points.push([]);
  });
  _.each(_.range(2 + N_INSIDE), function (i) {
    all_points.push([]);
  });
  
  noise.seed(Math.random());
  _.each(_.range(N_POINTS), function (i) {
    var angle = 2 * Math.PI * i / N_POINTS;

    var x_noise = 2 * Math.cos(angle);
    var y_noise = 2 * Math.sin(angle);

    // var r_mid = 1 + 0.3 * noise.perlin2(x_noise, y_noise)
    var r_mid = ngon(angle, 5)
    // var r_mid = 2 + 0.3 * Math.random();
    // var x_mid = 2 + r_mid * Math.cos(angle);
    // var y_mid = 2 + r_mid * Math.sin(angle);
    var x_mid = 2 + FACE[i][0]
    var y_mid = 2 + FACE[i][1]

    // var r_out = 1 + 0.1 * Math.random()
    var r_out = 1 + 0.3 * noise.perlin2(x_noise, y_noise)
    // var r_out = ngon(angle, 100)
    var x_out = 2 + 2 * r_out * Math.cos(angle);
    var y_out = 2 + 2 * r_out * Math.sin(angle);

    var r_in = ngon(angle, 9) + 0.1 * noise.perlin2(x_noise, y_noise)
    // var r_in = 1 + noise.perlin2(x_noise, y_noise)
    var x_in = 2 + 0.3 * r_in * Math.cos(angle);
    var y_in = 2 + 0.3 * r_in * Math.sin(angle);

    var index = 0;
    _.each(_.range(2 + N_OUTSIDE), function (j) {
      var f = j / (1 + N_OUTSIDE)
      var x = f * x_mid + (1 - f) * x_out
      var y = f * y_mid + (1 - f) * y_out
      all_points[j].push([x, y]);
      index += 1;
    });
    _.each(_.range(2 + N_INSIDE), function (j) {
      var f = j / (1 + N_INSIDE)
      var x = f * x_in + (1 - f) * x_mid
      var y = f * y_in + (1 - f) * y_mid
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
