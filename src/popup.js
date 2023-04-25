'use strict';

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector('.pop-up');
    this.popUpText = document.querySelector('.message');
    this.popUpRefresh = document.querySelector('.refresh');
    this.popUpRefresh.addEventListener('click', () => {
        this.onClick && this.onClick();
        this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove('pop-up--hide');
  }

  hide() {
    this.PopUp.classList.add('pop-up--hide');
  }
}