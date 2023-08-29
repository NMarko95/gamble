function gamble(gambleAmount) {
  const mainContainer = document.querySelector(".main-container");
  const mainCanvas = document.querySelector(".main-canvas");
  const historyCanvas = document.querySelector(".history-canvas");
  const gameContainer = document.querySelector(".game");

  const context = mainCanvas.getContext("2d");
  const historyContext = historyCanvas.getContext("2d");

  const imgDim = {
    width: 686,
    height: 976,
  };

  mainCanvas.width = imgDim.width;
  mainCanvas.height = imgDim.height;

  historyCanvas.width = imgDim.width * 4;
  historyCanvas.height = imgDim.height;

  let currentTime = Date.now(),
    lastRender = Date.now();

  let animationId;

  let black = "rgb(0, 0, 0)",
    red = "rgb(255, 0, 0)";

  let history = [];

  let currentColor = red;

  let amount = gambleAmount;
  let amountWin = amount * 2;
  let attempts = 5;

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

  btn = document.querySelector(".btn.black");
  btn.style.backgroundColor = black;

  let imgBlack = new Image();
  imgBlack.src = "black.png";

  let imgRed = new Image();
  imgRed.src = "red.png";

  let currentImg;

  function drawCard(isRed) {
    if (isRed) currentImg = imgRed;
    else currentImg = imgBlack;
    context.drawImage(
      currentImg,
      0,
      0,
      currentImg.width,
      currentImg.height,
      0,
      0,
      mainCanvas.width,
      mainCanvas.height
    );
  }

  function drawHistoryCard() {
    historyContext.clearRect(0, 0, historyCanvas.width, historyCanvas.height);
    history.forEach((card, i) => {
      currentImg = card === red ? imgRed : imgBlack;
      historyContext.drawImage(
        currentImg,
        0,
        0,
        currentImg.width,
        currentImg.height,
        ((history.length - 1 - i) * historyCanvas.width) / 4,
        0,
        historyCanvas.width / 5,
        historyCanvas.height
      );
    });
  }

  function starting() {
    if (lastRender - currentTime >= 80) {
      if (currentColor === red) {
        currentColor = black;
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
      amount = gambleAmount;
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
        amount = gambleAmount;
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

  let aspectRatioScreen = {
    widthScale: 16,
    heightScale: 9,
  };

  const ASPECT_RATIO_MAIN = 16 / 9;

  function resize(width, height, aspect) {
    if (width > height) {
      if (onloadScale > aspect) {
        gameHeight = height;
        gameWidth =
          (gameHeight * aspectRatioScreen.widthScale) /
          aspectRatioScreen.heightScale;
      } else {
        gameWidth = width;
        gameHeight =
          (gameWidth * aspectRatioScreen.heightScale) /
          aspectRatioScreen.widthScale;
      }
    } else {
      if (onloadScale > 1 / aspect) {
        gameHeight = outerHeight;
        gameWidth =
          (gameHeight * aspectRatioScreen.heightScale) /
          aspectRatioScreen.widthScale;
      } else {
        gameWidth = outerWidth;
        gameHeight =
          (gameWidth * aspectRatioScreen.widthScale) /
          aspectRatioScreen.heightScale;
      }
    }
    resizeElementsMain();
  }

  function resizeElementsMain() {
    mainContainer.style.width = gameWidth + "px";
    mainContainer.style.height = gameHeight + "px";
  }

  let onloadScale;

  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      checkWin(button.style.backgroundColor);
    });
  });

  animationId = requestAnimationFrame(starting);

  addEventListener("load", () => {
    drawCard(currentColor);
    onloadScale = innerWidth / innerHeight;
    resize(innerWidth, innerHeight, ASPECT_RATIO_MAIN);
  });

  window.onresize = function () {
    onloadScale = innerWidth / innerHeight;
    resize(innerWidth, innerHeight, ASPECT_RATIO_MAIN);
  };
}

gamble(100);
