class DrawableObject {
  img;
  imageCash = {};
  currentImage = 0;
  x = 120;
  y = 290;
  height = 150;
  width = 100;

  /**
   * Loads a single image
   * @param {string} path - Path to the image file
   * @description Creates a new Image object and sets its source
   */
  loadImage(path) {
    this.img = new Image(); // Durch this.img wird ein img in js erzeugt wie im html = document.getElementById('image'); <img id="image">
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
   * @description Renders the object's image at its current position
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a debug frame around the object
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
   * @description Draws a red rectangle around Character, Chicken, and smallChicken objects
   */
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

  /**
   * Loads multiple images into the image cache
   * @param {string[]} arr - Array of image paths to load
   * @description Preloads images for animations
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCash[path] = img;
    });
  }
}
