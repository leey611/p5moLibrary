function fstore_download() {
  // console.log('fstore_download ');
  let path = next_imagePath(my.count);
  my.lastDownloadPath = null;
  // ui_log('fstore_download next_imagePath ' + path);
  let { storage, ref, getDownloadURL } = fb_.fstore;
  getDownloadURL(ref(storage, path))
    .then((url) => {
      // `url` is the download URL for '1.jpeg'
      // ui_log('fstore_download url', url);

      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        // ui_log('fstore_download blob ' + blob);
        renderBlobToCanvas(blob);
        my.lastDownloadPath = path;
        ui_log('download ' + path);
      };
      xhr.open('GET', url);
      xhr.send();

      // Or inserted into an <img> element
      // let img = createImg(url, 'img test');
      // img.setAttribute('src', url);
    })
    .catch((error) => {
      // Handle any errors
      ui_error('fstore_getDownloadURL error', error);
      fill(0);
      rect(0, 0, width, height);
    });
}

// https://stackoverflow.com/questions/38004917/how-to-render-a-blob-on-a-canvas-element
// HTMLCanvasElement.prototype.renderImage = function(blob) {

function renderBlobToCanvas(blob) {
  let canvas = my.canvas.elt;
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(blob);
}
