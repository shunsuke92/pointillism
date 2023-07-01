const BASE_WINDOW_SIZE = 1700

let img;
let ratio;
let canvas;
let canvasWidth;
let canvasHeigh;
let fileName = 'sample';

const datas = [
  { img: 'hanabi.jpg',
    dotsNum: 1000,
    random: {
      dotsSizeMax: 8,
      dotsSizeMin: 0.5,
      sizeChangeSpeed: 0.002 // 大きいほど早く変化する
    }
  },
  { img: 'hanabi2.jpg',
    dotsNum: 1000,
    random: {
      dotsSizeMax: 8,
      dotsSizeMin: 0.5,
      sizeChangeSpeed: 0.002
    }
  },
  { img: 'night-view.jpg',
    dotsNum: 1000,
    dotsSize: 3,
  },
  { img: 'tokyo-station.jpg',
    dotsNum: 1000,
    dotsSize: 3,
  },
]


function getRandomInt (max) {
  return Math.floor(Math.random() * max);
};

const data = datas[getRandomInt(datas.length)];

function preload() {
  img = loadImage(`images/${data.img}`);
}

function setup() {
  noStroke();
  createMyCanvas();
}

function draw() {
  let nowDotsNum;
  let nowDotsSize;
  if(data.random !== undefined) {
    const nowNoise = noise(frameCount * data.random.sizeChangeSpeed);
    nowDotsNum = data.dotsNum * (canvasWidth / BASE_WINDOW_SIZE);
    nowDotsSize = (data.random.dotsSizeMax - nowNoise * (data.random.dotsSizeMax - data.random.dotsSizeMin)) * (canvasWidth / BASE_WINDOW_SIZE);

  }else {
    nowDotsNum = data.dotsNum * (canvasWidth / BASE_WINDOW_SIZE);
    nowDotsSize = data.dotsSize * (canvasWidth / BASE_WINDOW_SIZE);
  }

  console.log(nowDotsSize)

  for (let i = 0; i < nowDotsNum; i++) {
    const x = floor(random(img.width));
    const y = floor(random(img.height));
    const color = getPixel(x, y);
    fill(color);
    circle(x * ratio, y * ratio, nowDotsSize);
  }
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
    img.pixels[i], // red
    img.pixels[i + 1], // green
    img.pixels[i + 2], // blue
    img.pixels[i + 3], // alpha
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
