import type { GameType } from '.';

export class InputHandler {
  keys: KeyboardEvent['key'][];
  allowKeys: KeyboardEvent['key'][] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    ' ',
  ];

  constructor(public game: GameType) {
    this.keys = [];

    /* ---------------------------------- Init ---------------------------------- */
    window.addEventListener('keydown', (e) => {
      if (this.checkKey(e.key)) {
        this.keys.push(e.key);
      }

      if (e.key === 'd') {
        this.game.debug = !this.game.debug;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.allowKeys.includes(e.key)) {
        this.keys = this.keys.filter((key) => key !== e.key);
      }
    });
  }

  checkKey(key: string) {
    return !this.keys.includes(key) && this.allowKeys.includes(key);
  }
}

export type InputHandlerType = {
  keys: string[];
};
