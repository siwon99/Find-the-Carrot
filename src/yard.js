'use strict';
import * as sound from './sound.js';

const CARROT_SIZE = 120;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
  bomb: 'bomb',
})

export class Yard {
  constructor(carrotCount, bugCount, bombCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.bombCount = bombCount;

    this.yard = document.querySelector('.yard');
    this.yardRect = this.yard.getBoundingClientRect();
    this.yard.addEventListener('click', (e) => this.onClick(e));
  }

  init() {
    this.yard.innerHTML = '';
    this._addItem('carrot', this.carrotCount, 'img/carrot.png');
    this._addItem('bug', this.bugCount, 'img/bug.png');
    this._addItem('bomb', this.bombCount, 'img/bomb.png');
  }

  setClickListener(oncItemClick) {
    this.oncItemClick = oncItemClick;
  }

  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.yardRect.width - CARROT_SIZE;
    const y2 = this.yardRect.height - CARROT_SIZE;
  
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
  
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
  
      item.style.left = `${x}px`
      item.style.top = `${y}px`;
      this.yard.appendChild(item);
    }
  
    if (className === 'bug') {
      clearInterval(this.bugs);
      this. bugs = setInterval(() => {
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
      }, 100);
    } 
  
    if (className === 'bomb') {
      clearInterval(this.bombs);
      this.bombs = setInterval(() => {
        const bomb = document.createElement('img');
        bomb.setAttribute('class', 'bomb');
        bomb.setAttribute('src', imgPath);
        bomb.style.position = 'absolute';
  
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
  
        bomb.style.left = `${x}px`
        bomb.style.top = `${y}px`;
        this.yard.appendChild(bomb);
      }, 3000);
    }
  }

  onClick(event) {
    const target = event.target;
    if (target.matches('.carrot')) {
      target.remove();
      sound.playCarrot();
      this.oncItemClick && this.oncItemClick(ItemType.carrot);
    } else if (target.matches('.bug')) {
      this.oncItemClick && this.oncItemClick(ItemType.bug);
    } else if (target.matches('.bomb')) {
      this.oncItemClick && this.oncItemClick(ItemType.bomb);
    }
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}