'use strict'
import { gameBulider, Reason } from './game.js';
import PopUp from './popup.js';
import * as sound from './sound.js';

const game = new gameBulider()
  .withGameDuration(10)
  .withCarrotCount(10)
  .withBugCount(10)
  .build();

const gameFinishBanner = new PopUp();
game.setStopListener((reason) => {
  let message;
  switch(reason) {
    case Reason.win:
      message = 'YOU WON🎉';
      sound.playWin();
      break;
    case Reason.lose:
      message = 'YOU LOST💥';
      sound.playBug();
      break;
    case Reason.cancel:
      message = 'REPLAY❓';
      sound.playAlert();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});