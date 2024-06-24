import { GAME_FPS, type GameType } from '.';
import {
  DivingState,
  FallingState,
  HitState,
  JumpingState,
  RollingState,
  RunningState,
  SittingState,
  State,
  type StateType,
} from './player-states';

import playerImg from '../static/assets/player.png';
import { CollisionAnimation } from './collision-animation';

export const VERTICAL_VELOCITY = 27;
export const MAX_FRAME = {
  SITTING: 4,
  RUNNING: 8,
  JUMPING: 6,
  FALLING: 6,
  ROLLING: 6,
  DIVING: 6,
  HIT: 10,
} as const;

export const FRAME_Y = {
  SITTING: 5,
  RUNNING: 3,
  JUMPING: 1,
  FALLING: 2,
  ROLLING: 6,
  DIVING: 6,
  HIT: 4,
} as const;

export const PLAYER_SPEED = {
  SITTING_SPEED: 0,
  RUNNING_SPEED: 1,
  JUMPING_SPEED: 1,
  FALLING_SPEED: 1,
  ROLLING_SPEED: 2,
  DIVING_SPEED: 0,
} as const;

const image = new Image();
image.src = playerImg;

export class Player implements PlayerType {
  width: number;
  height: number;
  x: number;
  y: number;
  image: HTMLImageElement;
  speed: number;
  maxSpeed: number;
  vy: number;
  weight: number;
  currentState: StateType;
  frameX: number;
  frameY: number;
  states: StateType[];
  maxFrame: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;

  constructor(public game: GameType) {
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = MAX_FRAME.SITTING;
    this.image = image;
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 1;

    this.fps = GAME_FPS;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.states = [
      new SittingState(this.game),
      new RunningState(this.game),
      new JumpingState(this.game),
      new FallingState(this.game),
      new RollingState(this.game),
      new DivingState(this.game),
      new HitState(this.game),
    ];

    this.currentState = new SittingState(this.game);
  }

  update(input: KeyboardEvent['key'][], deltaTime: number) {
    this.currentState.handleInput(input);

    this.checkCollision();

    this.setHorizontalBoundaries();
    this.moveHorizontally(input);

    this.setVerticalBoundaries();
    this.moveVertically();

    this.animateFrame(deltaTime);
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

  setHorizontalBoundaries() {
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;
  }

  moveHorizontally(input: KeyboardEvent['key'][]) {
    this.x += this.speed;
    if (
      input.includes('ArrowRight') &&
      !(this.currentState instanceof HitState)
    )
      this.speed = this.maxSpeed;
    else if (
      input.includes('ArrowLeft') &&
      !(this.currentState instanceof HitState)
    )
      this.speed = -this.maxSpeed;
    else this.speed = 0;
  }

  setVerticalBoundaries() {
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.y = this.game.height - this.height - this.game.groundMargin;
  }

  moveVertically() {
    this.y += this.vy;
    if (!this.isOnGround()) this.vy += this.weight;
    else this.vy = 0;
  }

  animateFrame(deltaTime: number) {
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
      return;
    }

    this.frameTimer = 0;
    if (this.frameX < this.maxFrame) this.frameX += 1;
    else this.frameX = 0;
  }

  isOnGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state: number, speed: number): void {
    this.currentState = this.states[state];
    this.currentState.enter();
    this.game.speed = this.game.maxSpeed * speed;
  }

  checkCollision() {
    for (const enemy of this.game.enemies) {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5,
          ),
        );

        if (
          this.currentState instanceof RollingState ||
          this.currentState instanceof DivingState
        ) {
          this.game.score += 1;
        } else {
          this.setState(State.HIT, 0);
          this.game.lives -= 1;

          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    }
  }
}

export type PlayerType = {
  update(input: KeyboardEvent['key'][], deltaTime: number): void;
  draw(context: CanvasRenderingContext2D): void;
  setState(state: number, speed: number): void;
  isOnGround(): boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  vy: number;
  weight: number;
  maxFrame: number;
  states: StateType[];
  currentState: StateType;
};
