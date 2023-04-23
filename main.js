'use strict';

const CARROT_SIZE = 150;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

const yard = document.querySelector('.yard');
const yardRect = yard.getBoundingClientRect();

const playBtn = document.querySelector('.play');
const timerIndicator = document.querySelector('.timer');
const gameScore = document.querySelector('.score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.message');
const popUpRefresh = document.querySelector('.refresh');

let started = false;
let score = 0;
let timer = undefined;

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

//당근과 벌레 클릭 이벤트
yard.addEventListener('click', onYardClick); 

//게임 플레이 버튼
playBtn.addEventListener('click', () => {
  if(started) {
    stopGame();
  } else {
    startGame();
  }
});

// 게임 다시 시작버튼
popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

//게임 시작 함수
function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
}

//게임 멈추는 함수
function stopGame() {
  started = false;
  stopGameTimer();
  hideGameBtn();
  showPopUpText('REPLAY? 😮');
}

//게임 끝나는 함수
function finishGame(win) {
  started = false;
  hideGameBtn();
  stopGameTimer();
  showPopUpText(win ? 'YOU WON😍' : 'YOU LOST😭');
}

//게임 시작시 플레이버튼
function showStopBtn() {
  const icon = playBtn.querySelector('.fa-solid');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  playBtn.style.visibility = 'visible';
}

//게임 중 일시정지버튼
function hideGameBtn() {
  playBtn.style.visibility = 'hidden';
}

//게임 시작시 타이머와 점수
function showTimerAndScore() {
  timerIndicator.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

//게임 시작시 타이머
function startGameTimer() {
  let remainTime = GAME_DURATION_SEC;
  updateTimer(remainTime);
  timer = setInterval(() => {
    if(remainTime <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimer(--remainTime);
  }, 1000);
}

//게임 일시정지 타이머
function stopGameTimer() {
  clearInterval(timer);
}

//게임 중 타이머 업데이트
function updateTimer(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerIndicator.innerHTML = `${minutes}:${seconds}`;
}

//팝업창 띄우기
function showPopUpText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up--hide');
}

//팝업창 숨기기
function hidePopUp() {
  popUp.classList.add('pop-up--hide');
}

//게임 초기화
function initGame() {
  score = 0;
  yard.innerHTML = '';
  gameScore.innerHTML = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
}

//게임 랜덤 위치
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

//당근과 벌레를 클릭했을 경우
function onYardClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    UpdategameCounter();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    finishGame(false);
  }
}

//점수 업데이트하기
function UpdategameCounter() {
  gameScore.innerHTML = CARROT_COUNT - score;
}
