'use strict';
import PopUp from "./popup.js";

const CARROT_SIZE = 150;
const CARROT_COUNT = 20;
const BUG_COUNT = 10;
const BOMB_COUNT = 3;
const GAME_DURATION_SEC = 15;

const playBtn = document.querySelector('.play');
const timerIndicator = document.querySelector('.timer');
const gameScore = document.querySelector('.score');

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const winSound = new Audio("./sound/game_win.mp3");

let started = false;
let score = 0;
let timer = undefined;
let bombs = undefined;

const gameFinishBanner = new PopUp();

gameFinishBanner.setClickListener(() => {
  startGame();
});

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

  if (className === 'bug') {
    setInterval(() => {
      const bugs = document.getElementsByClassName('bug');
      for (let i = 0; i < bugs.length; i++) {
        const bug = bugs[i];
        const dx = randomNumber(-50, 50); // x축 이동량
        const dy = randomNumber(-50, 50); // y축 이동량

        // 버그의 새로운 위치 계산
        let left = parseInt(bug.style.left) + dx;
        let top = parseInt(bug.style.top) + dy;

        // 화면 경계 체크하여 벗어나면 다시 안으로 들어오도록 처리
        left = Math.max(x1, Math.min(left, x2));
        top = Math.max(y1, Math.min(top, y2));

        bug.style.left = `${left}px`;
        bug.style.top = `${top}px`;
      }
    }, 200);
  } 

  if (className === 'bomb') {
    bombs = setInterval(() => {
      const bomb = document.createElement('img');
      bomb.setAttribute('class', 'bomb');
      bomb.setAttribute('src', imgPath);
      bomb.style.position = 'absolute';

      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);

      bomb.style.left = `${x}px`
      bomb.style.top = `${y}px`;
      yard.appendChild(bomb);
    }, 3000);
  }
}

//당근과 벌레, 폭탄 클릭 이벤트
yard.addEventListener('click', onYardClick); 

//게임 플레이 버튼
playBtn.addEventListener('click', () => {
  if(started) {
    stopGame();
  } else {
    startGame();
  }
});

//게임 시작 함수
function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

//게임 멈추는 함수
function stopGame() {
  started = false;
  stopGameTimer();
  hideGameBtn();
  gameFinishBanner.showText('REPLAY? 😮');
  playSound(alertSound);
  stopSound(bgSound);
  stopBomb();
}

//게임 끝나는 함수
function finishGame(win) {
  started = false;
  if(win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopSound(bgSound);
  hideGameBtn();
  stopGameTimer();
  stopBomb();
  gameFinishBanner.showText(win ? 'YOU WON😍' : 'YOU LOST😭');
}

function stopBomb() {
  clearInterval(bombs);
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

//게임 초기화
function initGame() {
  score = 0;
  yard.innerHTML = '';
  gameScore.innerHTML = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
  addItem('bomb', BOMB_COUNT, 'img/bomb.png');
}

//게임 랜덤 위치
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

//당근과 벌레, 폭탄을 클릭했을 경우
function onYardClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    UpdategameCounter();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    finishGame(false);
  } else if (target.matches('.bomb')) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play(); 
}

function stopSound(sound) {
  sound.pause();
}

//점수 업데이트하기
function UpdategameCounter() {
  gameScore.innerHTML = CARROT_COUNT - score;
}
