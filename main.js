const speed = 1200,
  max = 20,
  min = 2,
  sizeChangeSpeed = 0.003, // 大きいほど早く変化する
  imgNum = 18;

let img,
  ratio,
  size,
  canvas,
  canvasWidth,
  canvasHeight,
  fileName = 'sample',
  count = 0,
  volatility;

function preload() {
  // ランダム表示は無効にする
  /* img = loadImage(`images/img_${floor(random(1, imgNum + 1))}.jpg`); */
  img = loadImage('images/img_6.jpg');
}

function setup() {
  size = max;
  volatility = max - min;
  noStroke();
  createMyCanvas();
}

function draw() {
  const nowNoise = noise(count);
  const nowSpeed = speed - (1 - nowNoise) * 500;
  const nowSize = size - nowNoise * volatility;

  for (let i = 0; i < nowSpeed; i++) {
    const x = floor(random(img.width));
    const y = floor(random(img.height));
    const color = getPixel(x, y);
    fill(color);
    circle(x * ratio, y * ratio, nowSize);
  }

  count += sizeChangeSpeed;
}

function createMyCanvas() {
  if (img.width / img.height > windowWidth / windowHeight) {
    // canvasの幅＝windowの幅
    ratio = windowWidth / img.width;
    canvasWidth = windowWidth;
    canvasHeight = windowWidth * (img.height / img.width);
  } else {
    // canvasの高さ＝windowの高さ
    ratio = windowHeight / img.height;
    canvasWidth = windowHeight * (img.width / img.height);
    canvasHeight = windowHeight;
  }

  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.drop(getFile);
  img.loadPixels();
}

function getPixel(x, y) {
  const i = (y * img.width + x) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}

function keyPressed() {
  // スペースキー押下で画像保存
  if (keyCode === 32) {
    saveImage();
  }
  return false;
}

function saveImage() {
  saveCanvas(canvas, fileName, 'png');
}

function getFile(file) {
  if (file.type !== 'image') return;

  fileName = file.name.slice(0, file.name.lastIndexOf('.'));

  let newImg = new Image();
  newImg.src = file.data;

  newImg.onload = () => {
    img.width = newImg.width;
    img.height = newImg.height;
    img.canvas.width = newImg.width;
    img.canvas.height = newImg.height;
    img.drawingContext.drawImage(newImg, 0, 0);
    img.modified = true;
    createMyCanvas();
  };
}
