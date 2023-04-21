'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const yard = document.querySelector('.yard');
const yardRect = yard.getBoundingClientRect();

const playBtn = document.querySelector('.play');
const timer = document.querySelector('.timer');
const scoreCount = document.querySelector('.score');

let started = false;
let finalScore = 0;
let finalTimer = undefined;

playBtn.addEventListener('click', () => {
  if(started) {
    stopGame();
  } else {
    startGame();
  }
  started = !started;
});

//게임 시작 함수
function startGame() {
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
}

//게임 끝나는 함수
function stopGame() {}

//게임 시작시 플레이버튼
function showStopBtn() {
  const icon = playBtn.querySelector('.fa-play');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
}

//게임 시작시 타이머와 점수
function showTimerAndScore() {
  timer.style.visibility = 'visible';
  scoreCount.style.visibility = 'visible';
}

function startGameTimer() {
  let remainTime = GAME_DURATION_SEC;
  updateTimer(remainTime);
  finalTimer = setInterval(() => {
    if(remainTime <= 0) {
      clearInterval(finalTimer);
      return;
    }
    updateTimer(--remainTime);
  }, 1000);
}

function updateTimer(finalTimer) {
  const minutes = Math.floor(finalTimer / 60);
  const seconds = finalTimer % 60;
  timer.innerText = `${minutes}:${seconds}`;
}

//게임 초기화
function initGame() {
  yard.innerHTML = '';
  scoreCount.innerHTML = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
}

//게임 아이템 
function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = yardRect.width - CARROT_SIZE;
  const y2 = yardRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`
    item.style.top = `${y}px`;
    yard.appendChild(item);
  }
}

//게임 랜덤 위치
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

initGame();
