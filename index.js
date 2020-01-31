import {makePNG} from './js/utils.js';

var sketch_name = 'wright_tile';
import redraw from './js/wright_tile.js';

function save() {
  _.each(document.getElementsByTagName("svg"), function(svg) {
    makePNG(svg.id, sketch_name);
  });
}

function draw() {
  redraw();
  // save();
}

draw();

module.exports = {
  draw: draw,
  save: save
};
