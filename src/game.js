'use strict';
import * as sound from './sound.js';
import {Yard, ItemType} from "./yard.js";

export const Reason = Object.freeze({
  win: 'win',
  lose : 'lose',
  cancel: 'cancel',
});

//Builder Pattern
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  carrotcount (num) {
    this.carrotcount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  bombCount(num) {
    this.bombCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration,
      this.carrotcount,
      this.bugCount,
      this.bombCount
    )
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount, bombCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.bombCount = bombCount;
    
    this.timerIndicator = document.querySelector('.timer');
    this.gameScore = document.querySelector('.score');
    this.playBtn = document.querySelector('.play');
    this.playBtn.addEventListener('click', () => {
      if(this.started) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.gameYard = new Yard(carrotCount, bugCount, bombCount);
    this.gameYard.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopBtn();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBg();
  }

  stop() {
    this.started = false;
    this.stopGameTimer();
    this.hideGameBtn();
    sound.playAlert();
    sound.stopBg();
    this.onGameStop && this.onGameStop(Reason.cancel);
  }

  finish(win) {
    this.started = false;
    this.hideGameBtn();
    if(win) {
      sound.playWin();
    } else {
      sound.playBug();
    }
    sound.stopBg();
    this.stopGameTimer();
    this.onGameStop && this.onGameStop(win ? Reason.win : Reason.lose);
  }

  onItemClick = item => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.UpdategameCounter();
      if (this.score === this.carrotCount) {
        this.finish(true);
      }
    } else if (item === ItemType.bug) {
      this.finish(false);
    } else if (item === ItemType.bomb) {
      this.finish(false);
    }
  };

  showStopBtn() {
    const icon = this.playBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.playBtn.style.visibility = 'visible';
  }

  hideGameBtn() {
    this.playBtn.style.visibility = 'hidden';
  }

  showTimerAndScore() {
    this.timerIndicator.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  startGameTimer() {
    let remainTime = this.gameDuration;
    this.updateTimer(remainTime);
    this.timer = setInterval(() => {
      if(remainTime <= 0) {
        clearInterval(this.timer);
        this.finish(this.score === this.carrotCount);
        return;
      }
      this.updateTimer(--remainTime);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimer(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.timerIndicator.innerHTML = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerHTML = this.carrotCount;
    this.gameYard.init();
  }

  UpdategameCounter() {
    this.gameScore.innerHTML = this.carrotCount - this.score;
  }
}