const mainContainer = document.querySelector(".main-container");
const mainCanvas = document.querySelector(".main-canvas");
const historyCanvas = document.querySelector(".history-canvas");

const c = mainCanvas.getContext("2d");
const historyC = historyCanvas.getContext("2d");

let currentTime = Date.now(),
  lastRender = Date.now();

let animationId;

let blue = "rgb(0, 0, 255)",
  red = "rgb(255, 0, 0)";

let history = [];

let currentColor = red;

let amount = 50;
let amountWin = amount * 2;
let attempts = 5;

let cardPosition = {
  x: mainCanvas.width / 2 - 75,
  y: mainCanvas.height / 2 - 125,
};

const text = document.querySelector(".display-text");
const btns = document.querySelectorAll(".btn");
const attemptsValue = document.querySelector(".attempts-value");
attemptsValue.innerHTML = attempts;
const gambleWinValue = document.querySelector(".gamble-win-value");
gambleWinValue.innerHTML = amountWin;
const gambleAmountValue = document.querySelector(".gamble-amount-value");
gambleAmountValue.innerHTML = amount;

let btn = document.querySelector(".btn.red");
btn.style.backgroundColor = red;

btn = document.querySelector(".btn.blue");
btn.style.backgroundColor = blue;

function drawCard(isRed) {
  const img = new Image();
  img.onload = () => {
    c.drawImage(
      img,
      isRed ? 26 : img.width / 2 + 5,
      15,
      img.width / 2 - 30,
      img.height - 30,
      0,
      0,
      mainCanvas.width,
      mainCanvas.height
    );
  };
  img.src = "cards.jpg";
}

function drawHistoryCard() {
  historyC.clearRect(0, 0, historyCanvas.widith, historyCanvas.height);
  let img = new Image();
  img.onload = () => {
    history.forEach((card, i) => {
      historyC.drawImage(
        img,
        card === red ? 25 : img.width / 2 + 5,
        15,
        img.width / 2 - 30,
        img.height - 30,
        ((history.length - 1 - i) * historyCanvas.width) / 4,
        0,
        historyCanvas.width / 5,
        historyCanvas.height
      );
    });
  };
  img.src = "cards.jpg";
}

function starting() {
  if (lastRender - currentTime >= 100) {
    if (currentColor === red) {
      currentColor = blue;
      drawCard(false);
    } else {
      currentColor = red;
      drawCard(true);
    }
    currentTime = Date.now();
  }
  lastRender = Date.now();
  animationId = requestAnimationFrame(starting);
}

function addToHistory(color) {
  history.push(color);
  drawHistoryCard();
}

function checkWin(color) {
  if (currentColor === color) {
    attempts -= 1;
    text.innerHTML = "WIN";
  } else {
    attempts = 5;
    amount = 50;
    text.innerHTML = "LOSE";
  }
  amountWin = amount * 2;
  attemptsValue.innerHTML = attempts;
  gambleAmountValue.innerHTML = amount;
  gambleWinValue.innerHTML = amountWin;
  cancelAnimationFrame(animationId);
  disableSwitch(true);
  addToHistory(currentColor);
  setTimeout(() => {
    if (attempts === 0) {
      amount = 50;
      attempts = 5;
      console.log("You won 5 times in a row!");
    } else {
      amount = amountWin;
    }
    text.innerHTML = "";
    disableSwitch(false);
    starting();
  }, 2000);
}

function disableSwitch(condition) {
  btns.forEach((btn) => {
    btn.disabled = condition;
  });
}

let containerHeight, containerWidth;

function proportionalScale(isLandscape) {
  containerHeight = parseInt(mainContainer.style.height.split("p")[0]);
  containerWidth = parseInt(mainContainer.style.width.split("p")[0]);
  if (isLandscape) {
    if (containerHeight >= innerHeight && innerWidth >= containerWidth) {
      mainContainer.style.height = `${innerHeight}px`;
      mainContainer.style.width = `${(parseFloat(innerHeight) * 16) / 9}px`;
    } else {
      mainContainer.style.width = `${innerWidth}px`;
      mainContainer.style.height = `${(parseFloat(innerWidth) * 9) / 16}px`;
    }
  } else {
    if (containerWidth >= innerWidth && innerHeight >= containerHeight) {
      mainContainer.style.width = `${innerWidth}px`;
      mainContainer.style.height = `${(parseFloat(innerWidth) * 16) / 9}px`;
    } else {
      mainContainer.style.height = `${innerHeight}px`;
      mainContainer.style.width = `${(parseFloat(innerHeight) * 9) / 16}px`;
    }
  }
}

const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    checkWin(button.style.backgroundColor);
  });
});

drawCard(currentColor);

animationId = requestAnimationFrame(starting);

addEventListener("load", () => {
  proportionalScale(innerWidth > innerHeight);
});

addEventListener("resize", () => {
  proportionalScale(innerWidth > innerHeight);
});
