class DrawableObject {
  img;
  imageCash = {};
  currentImage = 0;
  x = 120;
  y = 290;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image(); // Durch this.img wird ein img in js erzeugt wie im html = document.getElementById('image'); <img id="image">
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

   drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof smallChicken
    ) {
      // instanceof greift nur auf die weiligen Characktere ein.
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "red";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCash[path] = img;
    });
  }
}
