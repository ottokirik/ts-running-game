import boomImg from '../static/assets/boom.png';

import type { GameType } from '.';

const boom = new Image();
boom.src = boomImg;

export class CollisionAnimation {
  image = boom;
  spriteWidth = 100;
  spriteHeight = 90;
  sizeModifier = Math.random() + 0.5;
  width = this.spriteWidth * this.sizeModifier;
  height = this.spriteHeight * this.sizeModifier;
  frameX = 0;
  maxFrame = 4;
  markForDeletion = false;
  fps = Math.random() * 10 + 5;
  frameInterval = 1000 / this.fps;
  frameTimer = 0;

  x: number;
  y: number;

  constructor(
    public game: GameType,
    x: number,
    y: number,
  ) {
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  update(deltaTime: number) {
    this.x -= this.game.speed;

    if (this.frameTimer > this.frameInterval) {
      this.frameX += 1;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    if (this.frameX > this.maxFrame) {
      this.markForDeletion = true;
    }
  }
}
