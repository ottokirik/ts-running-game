import type { GameType } from '.';

import livesImg from '../static/assets/lives.png';

const lives = new Image();
lives.src = livesImg;

export class UI {
  fontSize = 30;
  fontFamily = 'Helvetica';

  constructor(public game: GameType) {}

  draw(context: CanvasRenderingContext2D) {
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillStyle = 'black';
    context.textAlign = 'left';
    context.fillText(`Score: ${this.game.score}`, 20, 50);

    context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;

    const secs = (this.game.time * 0.001).toFixed(1);
    context.fillText(`Time: ${secs}`, 20, 80);

    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(lives, 25 * i + 20, 95, 25, 25);
    }

    if (this.game.gameOver) {
      context.textAlign = 'center';
      context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
      context.fillText(
        'Boo-yah',
        this.game.width * 0.5,
        this.game.height * 0.5,
      );
    }
  }
}
