import {makeSVG, jitter} from './utils.js';

// http://simoncpage.co.uk/blog/2009/08/random-dance-geometric-poster-designs/
// http://www.pbase.com/brownsf/amish_quilts
// http://www.pbase.com/brownsf/image/84992170
// http://www.pbase.com/brownsf/image/12150606
function rando() {
  var h = 360 * Math.random();
  var c = 80 + 20 * Math.random()
  var l = 80 + 20 * Math.random()
  return chroma.hcl(h, c, l)
}

function compliment(color) {
  var h = color.hcl()[0] + 180
  var c = color.hcl()[1]
  var l = 0.5 * ((100 - color.hcl()[2]) + color.hcl()[2])
  return chroma.hcl(h, c, l).hex()
}

export default function redraw () {
  var SVG_ID = '#canvas'
  var N_X = 10
  var N_Y = 10
  var N_SQUARES = 20;
  var STROKE_COLOR = chroma('gold').darken(2);
  var STROKE_WIDTH = 0.03;
  var GRID_OPACITY = 0.8;
  var EYE_OPACITY = 1;
  var CIRCLE_OPACITY = 1;
  var TAIL_OPACITY = 1;
  var GRID_FILL = chroma('gold').brighten(4);
  var EYE_FILL = chroma('gold').darken(2.5);
  var CIRCLE_FILL = chroma('gold').darken(0.5);
  var TAIL_FILL = chroma('gold').darken(1);
  var TEXTURE_COLOR = chroma('white');
  
  // make an svg with a viewbox
  var s = makeSVG(SVG_ID, N_X, N_Y)

  // Sets Math.random to a PRNG initialized using the given explicit seed.
  // var seed = 8;
  // Math.seedrandom(seed);

  // _.each(_.range(N_X), function (x) {
  //   _.each(_.range(N_Y), function (y) {
  //     s.rect(x, y, 1, 1).attr({
  //       fill: chroma.hsv(0, 0.02, 0.98).hex(),
  //       stroke: STROKE_COLOR,
  //       strokeWidth: 0.0
  //     })
  //   })
  // })

  var xs = [];
  var x = 0;
  while (x < N_X) {
    xs.push(x);
    x += _.random(1, 6) / 6;
  };

  var ys = [];
  var y = 0;
  while (y < N_Y) {
    ys.push(y);
    y += _.random(2, 12) / 6;
  };

  var colors = [
    chroma.rgb(166,90,42),
    chroma.rgb(223,188,130),
    chroma.rgb(160,117,111),
    chroma.rgb(114,117,130),
  ];
  
  _.each(xs, function(x, x_i) {
    _.each(ys, function(y, y_i) {
      var next_x = xs[x_i + 1];
      var next_y = ys[y_i + 1];
      if (next_x === undefined) {
        next_x = N_X;
      }
      if (next_y === undefined) {
        next_y = N_Y;
      }
      s.rect(x, y, next_x - x, next_y - y).attr({
        fill: _.sample(colors),
        opacity: GRID_OPACITY,
        stroke: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      })
      
    });
  });

  var colors = [
    chroma.rgb(194,79,43),
    chroma.rgb(119,121,68),
    chroma.rgb(201,100,50),
    chroma.rgb(113,129,163),
  ];
  
  var n_concentric = 3;
  var squares = [];
  var x = _.random(0, N_X - 1);
  var y = _.random(0, N_Y - 1);
  _.each(_.range(N_SQUARES), function (i) {
    var base_color = _.sample(colors);
    var scale = chroma.scale([chroma.rgb(223,188,130), base_color]).colors(n_concentric)
    squares.push({x: x, y: y, scale: scale});
    x += _.random(-2, 2);
    y += _.random(-2, 2);
    x = (x + N_X) % N_X;
    y = (y + N_Y) % N_Y;
  })


  var n_skinny = 6;
  _.each(squares, function (i) {
    var n_long = _.random(1, 3);
    var length = _.random(0, N_Y - i.y - 1);
    if ((i.y + length) < (N_Y - 1) && (length > 0)) {
      _.each(_.range(n_concentric, 0, -1), function (j) {
        s.circle(i.x + 1/2, i.y + length + 1, (j / 2) / n_concentric).attr({
          fill: i.scale[0],
          opacity: CIRCLE_OPACITY,
          stroke: STROKE_COLOR,
          strokeWidth: STROKE_WIDTH,
        });
      });
    }
    _.each(_.range(length), function (j) {
      _.each(_.range(n_skinny), function (k) {
        _.each(_.range(n_long+(k%2)), function (l) {
          var x = i.x + k/n_skinny;
          var y = i.y + j + 1 + ((l - (1/2)*(k%2))/n_long);
          var y2 = i.y + j + 1 + ((l - (1/2)*(k%2))/n_long) + 1/n_long;
          if (y2 > (i.y + length)) {
            y2 = i.y + length + 1;
          }
          var height = y2 - y;
          console.log(i.x, i.y, j, k, l, l%3);
          s.rect(x, y, 1/n_skinny, height).attr({
            fill: i.scale[l%3],
            opacity: TAIL_OPACITY,
            stroke: STROKE_COLOR,
            strokeWidth: STROKE_WIDTH,
          });
        });
      });
    })

    _.each(_.range(n_concentric, 0, -1), function (j) {
      s.rect(i.x + 1/2 - (j / n_concentric) / 2, i.y + 1/2 - (j / n_concentric) / 2, j / n_concentric, j / n_concentric).attr({
        fill: i.scale[j - 1],
        opacity: EYE_OPACITY,
        stroke: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      })
    });
    
    
  });

  var N_TEXTURE = 2000;
  _.each(_.range(N_TEXTURE), function (i) {
    var x = N_X * Math.random();
    var y = N_Y * Math.random();
    s.ellipse(x, y, 0.01 * Math.random(), 1 * Math.random()).attr({
      fill: TEXTURE_COLOR,
      opacity: 0.1
    });
    
  });
  
}
