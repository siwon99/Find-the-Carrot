'use strict';

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector('.pop-up');
    this.popUpText = document.querySelector('.message');
    this.popUpRefresh = document.querySelector('.refresh');

    this.popUpRefresh.addEventListener('click', () => {
        this._hide();
        this.onClick && this.onClick();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove('pop-up--hide');
  }

  _hide() {
    this.popUp.classList.add('pop-up--hide');
  }
}