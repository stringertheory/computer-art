import redraw from './js/kandinsky.js';
import {makePNG} from './js/utils.js';

function save() {
  _.each(document.getElementsByTagName("svg"), function(svg) {
    makePNG(svg.id);
  });
}

function draw() {
  redraw();
  save();
}

draw();

module.exports = {
  draw: draw,
  download: makePNG
};
