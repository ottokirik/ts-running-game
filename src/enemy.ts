import { GAME_FPS, type GameType } from '.';

import enemyFlyImg from '../static/assets/enemy_fly.png';
import enemyClimbingImg from '../static/assets/enemy_spider_big.png';
import enemyGroundImg from '../static/assets/enemy_plant.png';

const enemyFly = new Image();
enemyFly.src = enemyFlyImg;

const enemyClimbing = new Image();
enemyClimbing.src = enemyClimbingImg;

const enemyGround = new Image();
enemyGround.src = enemyGroundImg;

class Enemy {
  frameX = 0;
  frameY = 0;
  fps = GAME_FPS;
  frameInterval = 1000 / this.fps;
  frameTimer = 0;
  speedX = 0;
  speedY = 0;
  maxFrame = 0;
  x = 0;
  y = 0;
  markForDeletion = false;

  constructor(
    public game: GameType,
    public image: HTMLImageElement,
    public width: number,
    public height: number,
  ) {}

  update(deltaTime: number) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame) this.frameX += 1;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    if (this.x + this.width < 0) this.markForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

export class FlyingEnemy extends Enemy {
  speedX = Math.random() + 1;
  maxFrame = 5;
  angle = 0;
  va = Math.random() * 0.1 + 0.1;

  constructor(game: GameType) {
    super(game, enemyFly, 60, 44);
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
  }

  update(deltaTime: number) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class ClimbingEnemy extends Enemy {
  maxFrame = 5;

  constructor(game: GameType) {
    super(game, enemyClimbing, 120, 144);
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.speedY *= -1;
    }

    if (this.y < -this.height) {
      this.markForDeletion = true;
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width * 0.5, 0);
    context.lineTo(this.x + this.width * 0.5, this.y + 50);
    context.stroke();
    context.closePath();
  }
}

export class GroundEnemy extends Enemy {
  maxFrame = 1;

  constructor(game: GameType) {
    super(game, enemyGround, 60, 87);
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
  }
}

export type EnemyType = FlyingEnemy | ClimbingEnemy | GroundEnemy;
