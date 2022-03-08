'use strict';

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
});

export class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', event => this.onItemClick(event));
  }

  init() {
    this.field.innerHTML = '';
    this._addItem('carrot', this.carrotCount, 'img/carrot.png');
    this._addItem('bug', this.carrotCount, 'img/bug.png');
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, pathImg) {
    for(let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.setAttribute('class', className);
      img.setAttribute('src', pathImg);
      
      const left = (this.fieldRect.width - CARROT_SIZE) * Math.random();
      const top = (this.fieldRect.height - CARROT_SIZE) * Math.random();
      img.style.left = `${left}px`;
      img.style.top = `${top}px`;  
      this.field.appendChild(img);
    }
  }
}  