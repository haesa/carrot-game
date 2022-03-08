'use strict';
import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export class gameBulider {
  withGameDuration(num) {
    this.gameDuration = num;
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration,  //
      this.carrotCount,
      this.bugCount
    );
  }
}

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.field = new Field(carrotCount, bugCount);
    this.field.setClickListener(this.onItemClick);
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
      if(this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });
    
    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.score = 0;
    this.gameScore.textContent = this.carrotCount;
    this.showButton();
    this.showTimerAndCount();
    this.startTimer();
    this.field.init();
    sound.playBackground();
  }

  stop(reason) {
    this.started = false;
    this.stopTimer();
    this.hideButton();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = event => {
    if(!this.started) {
      return;
    }
    const target = event.target;
    if (target.matches('.carrot')) {
      target.remove();
      this.score++;
      this.updateScoreBoard();
      sound.playCarrot();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (target.matches('.bug')) {
      this.stop(Reason.lose);
    }
  };

  startTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if(remainingTimeSec <= 0) {
        this.stop(Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.textContent = `${minutes}:${seconds}`;
  }

  updateScoreBoard() {
    this.gameScore.textContent = this.carrotCount - this.score;
  }

  showTimerAndCount() {
    this.gameTimer.classList.add('show-timer-score');
    this.gameScore.classList.add('show-timer-score'); 
  }

  showButton() {
    const icon = this.gameBtn.querySelector('.fa-solid');
    if(this.started) {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-stop');
    }
    this.gameBtn.classList.remove('game__button--hide');  
  }

  hideButton() {
    this.gameBtn.classList.add('game__button--hide');
  }
}