
function setSeed() {
  // explicitly seed Math.random using hash
  var seed = window.location.hash;
  if (seed) {
    console.log(seed);
    Math.seedrandom(seed)
  } else {
    Math.seedrandom()
  }
}

function makeSVG(n_x, n_y, border=0) {

  var WIDTH = 500;
  
  setSeed();
  
  var s = Snap('#canvas')
  s.clear()
  s.attr({
    width: WIDTH,
    height: WIDTH * (n_y / n_x),
    viewBox: Snap.format('{min_x} {min_y} {width} {height}', {
      min_x: -border,
      min_y: -border,
      width: n_x + 2*border,
      height: n_y + 2*border
    }),
    // transform: "scale(-1,1)",
    // transform: "rotate(180)"
  })
  var g = s.group()
  // g.rect(-1, -1, n_x + 2, n_y + 2).attr({
  //   // fill: chroma.hcl(90, 1, 100),
  //   // fill: chroma.hcl(135, 10, 10),
  //   fill: 'none',
  //   stroke: 'none'
  // })
  // g.transform(
  //   Snap.format('r{angle},{x_center},{y_center}', {
  //     angle: 180,
  //     x_center: n_x / 2,
  //     y_center: n_y / 2
  //   })
  // )
  return g
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string doesn't handle
  // URLEncoded DataURIs - see SO answer #6850276 for code that does
  // this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

function download(svg_id='#canvas') {
  if (svg_id[0] === '#') {
    var svg_id = svg_id.split('#')[1];
  }
  var svg = document.getElementById(svg_id);
  svg.toDataURL("image/png", {
    callback : function(data) {
      var image = data.replace("image/png", "image/octet-stream");

      var hash_pre = md5(image)
      console.log(hash_pre, window.location.pathname);
      var hash = hash_pre.substring(0, 6)
      var filename = window.location.pathname + window.location.hash + '-' + hash;
      var png_filename = filename + ".png";
      var svg_filename = filename + ".svg";

      var blob = dataURItoBlob(image);
      var blobUrl = URL.createObjectURL(blob);
      download_as_file(png_filename, blobUrl);

      var svgString = (new XMLSerializer()).serializeToString(svg);
      var svgUrl = 'data:text/plain;charset=utf-8,';
      svgUrl += encodeURIComponent(svgString);
      download_as_file(svg_filename, svgUrl);
    }
  });
}

function download_paper(id='#canvas') {
  if (id[0] === '#') {
    var id = id.split('#')[1];
  }
  var canvas = document.getElementById(id);
  var hash_pre = md5(canvas)
  console.log(hash_pre, window.location.pathname);
  var hash = hash_pre.substring(0, 6)
  var filename = window.location.pathname + window.location.hash + '-' + hash;
  var png_filename = filename + ".png";
  download_as_file(png_filename, canvas.toDataURL());
}

function download_as_file(filename, url) {
  console.log(filename);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
}

function jitter(amount) {
  return amount * (Math.random() - 0.5);
}

function convertToPath(points) {
  var path = '';
  _.each(points, function (point, index) {
    var x = point[0]
    var y = point[1]
    if (index === 0) {
      path += 'M' + x + ',' + y + ' R'
    } else if (index === points.length - 1) {
      path += x + ',' + y
    } else {
      path += x + ',' + y + ','
    }
  })
  return path;
}


function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function compliment(color, angle) {
  if (angle === undefined) {
    angle = 180;
  }
  var h = color.hcl()[0] + angle
  var c = color.hcl()[1]
  var l = 0.5 * ((100 - color.hcl()[2]) + color.hcl()[2])
  return chroma.hcl(h, c, l).hex()
}
