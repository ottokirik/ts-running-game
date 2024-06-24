import type { GameType } from '.';

import fireImg from '../static/assets/fire.png';

const fire = new Image();
fire.src = fireImg;

class Particle {
  markForDeletion = false;

  x = 0;
  y = 0;
  speedX = 0;
  speedY = 0;
  size = 0;

  constructor(public game: GameType) {}

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;

    if (this.size < 0.5) this.markForDeletion = true;
  }
}

export class Dust extends Particle {
  color = 'rgba(0, 0, 0, 0.2)';

  constructor(game: GameType, x: number, y: number) {
    super(game);
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }
}

export class Splash extends Particle {
  image: HTMLImageElement;
  gravity: number;

  constructor(game: GameType, x: number, y: number) {
    super(game);
    this.image = fire;
    this.size = Math.random() * 100 + 100;
    this.x = x - this.size * 0.4;
    this.y = y - this.size * 0.5;
    this.speedX = Math.random() * 6 - 4;
    this.speedY = Math.random() * 2 + 2;
    this.gravity = 0;
  }

  update() {
    super.update();
    this.gravity += 0.1;
    this.y += this.gravity;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

export class Fire extends Particle {
  image: HTMLImageElement;
  angle: number;
  va: number;

  constructor(game: GameType, x: number, y: number) {
    super(game);
    this.image = fire;
    this.size = Math.random() * 100 + 50;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }

  update(): void {
    super.update();
    this.angle += this.va;
    this.x += Math.sin(this.angle + 10);
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size,
    );
    context.restore();
  }
}

export type ParticleType = Dust | Splash | Fire;
