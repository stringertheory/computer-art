_.each(document.getElementsByTagName("svg"), function(svg) {
  console.log(svg)
  makePNG(svg.id);
});
