'use strict'

const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 100;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameCount = document.querySelector('.game__count');
const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');

let started = false;
let score = 0;
let timer = undefined;

gameBtn.addEventListener('click', () => {
  if(started) {
    stopGame('REPLAY❓');
    playSound(alertSound);
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopup(); // hide pop up
  showGameButton(); // show game button
});

field.addEventListener('click', onFieldClick);

function startGame() {
  started = true;
  initGame();
  showGameButton();
  showTimerAndCount();
  startGameTimer();
  playSound(bgSound);
}

function stopGame(text) {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWidthText(text);
  stopSound(bgSound);
}

function showGameButton() {
  const icon = gameBtn.querySelector('.fa-solid');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.classList.remove('game__button--hide');
}

function hideGameButton() {
  gameBtn.classList.add('game__button--hide');
}

function showTimerAndCount() {
  gameTimer.classList.add('show-timer-count');
  gameCount.classList.add('show-timer-count'); 
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if(remainingTimeSec <= 0) {
      stopGame(`TIME'S UP💥`);
      playSound(bugSound);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.textContent = `${minutes}:${seconds}`;
}

function updateScoreBoard() {
  gameCount.textContent = CARROT_COUNT - score;
}

function showPopUpWidthText(text) {
  popUpText.textContent = text;
  popUp.classList.remove('pop-up--hide');
}

function hidePopup() {
  popUp.classList.add('pop-up--hide');
}

function onFieldClick (event) {
  if (!started || event.target.tagName !== 'IMG') {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    updateScoreBoard();
    playSound(carrotSound);
    if (score === CARROT_COUNT) {
      stopGame('YOU WON✨');
      playSound(winSound);
    }
  } else if (target.matches('.bug')) {
    stopGame('YOU LOST❌');
    playSound(bugSound);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  gameCount.textContent = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, './img/carrot.png');
  addItem('bug', BUG_COUNT, './img/bug.png');
}

// 생성하고자 하는 img name 전달
function addItem(className, count, pathImg) {
  for(let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.setAttribute('class', className);
    img.setAttribute('src', pathImg);
    
    const left = (fieldRect.width - CARROT_SIZE) * Math.random();
    const top = (fieldRect.height - CARROT_SIZE) * Math.random();
    img.style.transform = `translate(${left}px, ${top}px)`;
    field.appendChild(img);
  }
}