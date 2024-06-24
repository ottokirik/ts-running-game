import type { GameType } from '.';
import { Dust, Fire, Splash } from './particle';
import { FRAME_Y, MAX_FRAME, PLAYER_SPEED, VERTICAL_VELOCITY } from './player';

export enum State {
  SITTING = 0,
  RUNNING = 1,
  JUMPING = 2,
  FALLING = 3,
  ROLLING = 4,
  DIVING = 5,
  HIT = 6,
}

export class SittingState implements StateType {
  state: string;

  constructor(public game: GameType) {
    this.state = 'SITTING_STATE';
  }

  handleInput(input: KeyboardEvent['key'][]): void {
    if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
      this.game.player.setState(State.RUNNING, PLAYER_SPEED.RUNNING_SPEED);
    }

    if (input.includes(' ')) {
      this.game.player.setState(State.ROLLING, PLAYER_SPEED.ROLLING_SPEED);
    }
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.frameY = FRAME_Y.SITTING;
    this.game.player.maxFrame = MAX_FRAME.SITTING;
  }
}

export class RunningState implements StateType {
  state: string;

  constructor(public game: GameType) {
    this.state = 'RUNNING_STATE';
  }

  handleInput(input: KeyboardEvent['key'][]): void {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height,
      ),
    );

    if (input.includes('ArrowDown')) {
      this.game.player.setState(State.SITTING, PLAYER_SPEED.SITTING_SPEED);
    }

    if (input.includes('ArrowUp')) {
      this.game.player.setState(State.JUMPING, PLAYER_SPEED.JUMPING_SPEED);
    }

    if (input.includes(' ')) {
      this.game.player.setState(State.ROLLING, PLAYER_SPEED.ROLLING_SPEED);
    }
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.frameY = FRAME_Y.RUNNING;
    this.game.player.maxFrame = MAX_FRAME.RUNNING;
  }
}

export class JumpingState implements StateType {
  state: string;

  constructor(public game: GameType) {
    this.state = 'JUMPING_STATE';
  }

  handleInput(input: KeyboardEvent['key'][]): void {
    if (this.game.player.vy > this.game.player.weight) {
      this.game.player.setState(State.FALLING, PLAYER_SPEED.FALLING_SPEED);
    }

    if (input.includes(' ')) {
      this.game.player.setState(State.ROLLING, PLAYER_SPEED.ROLLING_SPEED);
    }

    if (input.includes('ArrowDown')) {
      this.game.player.setState(State.DIVING, PLAYER_SPEED.DIVING_SPEED);
    }
  }

  enter(): void {
    if (this.game.player.isOnGround()) this.game.player.vy -= VERTICAL_VELOCITY;
    this.game.player.frameX = 0;
    this.game.player.frameY = FRAME_Y.JUMPING;
    this.game.player.maxFrame = MAX_FRAME.JUMPING;
  }
}

export class FallingState implements StateType {
  state: string;

  constructor(public game: GameType) {
    this.state = 'FALLING_STATE';
  }

  handleInput(input: KeyboardEvent['key'][]): void {
    if (this.game.player.isOnGround()) {
      this.game.player.setState(State.RUNNING, PLAYER_SPEED.RUNNING_SPEED);
    }

    if (input.includes('ArrowDown')) {
      this.game.player.setState(State.DIVING, PLAYER_SPEED.DIVING_SPEED);
    }
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.frameY = FRAME_Y.FALLING;
    this.game.player.maxFrame = MAX_FRAME.FALLING;
  }
}

export class RollingState implements StateType {
  state: string;

  constructor(public game: GameType) {
    this.state = 'ROLLING_STATE';
  }

  handleInput(input: KeyboardEvent['key'][]): void {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.75,
        this.game.player.y + this.game.player.height * 0.5,
      ),
    );

    if (!input.includes(' ') && this.game.player.isOnGround()) {
      this.game.player.setState(State.RUNNING, PLAYER_SPEED.RUNNING_SPEED);
    }

    if (!input.includes(' ') && !this.game.player.isOnGround()) {
      this.game.player.setState(State.FALLING, PLAYER_SPEED.FALLING_SPEED);
    }

    if (
      input.includes(' ') &&
      input.includes('ArrowUp') &&
      this.game.player.isOnGround()
    ) {
      this.game.player.vy -= VERTICAL_VELOCITY;
    }

    if (input.includes('ArrowDown') && !this.game.player.isOnGround()) {
      this.game.player.setState(State.DIVING, PLAYER_SPEED.DIVING_SPEED);
    }
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.frameY = FRAME_Y.ROLLING;
    this.game.player.maxFrame = MAX_FRAME.ROLLING;
  }
}

export class DivingState implements StateType {
  state: string;

  constructor(public game: GameType) {
    this.state = 'DIVING_STATE';
  }

  handleInput(input: KeyboardEvent['key'][]): void {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.75,
        this.game.player.y + this.game.player.height * 0.5,
      ),
    );

    if (this.game.player.isOnGround()) {
      for (let i = 0; i < 30; i += 1) {
        this.game.particles.unshift(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height,
          ),
        );
      }
      this.game.player.setState(State.RUNNING, PLAYER_SPEED.RUNNING_SPEED);
    }

    if (input.includes(' ') && this.game.player.isOnGround()) {
      this.game.player.setState(State.ROLLING, PLAYER_SPEED.ROLLING_SPEED);
    }
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.frameY = FRAME_Y.DIVING;
    this.game.player.maxFrame = MAX_FRAME.DIVING;
    this.game.player.vy = 15;
  }
}

export class HitState implements StateType {
  state: string;

  constructor(public game: GameType) {
    this.state = 'HIT_STATE';
  }

  handleInput(): void {
    if (this.game.player.frameX >= 10 && this.game.player.isOnGround()) {
      this.game.player.setState(State.RUNNING, PLAYER_SPEED.RUNNING_SPEED);
    }

    if (this.game.player.frameX >= 10 && !this.game.player.isOnGround()) {
      this.game.player.setState(State.FALLING, PLAYER_SPEED.FALLING_SPEED);
    }
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.frameY = FRAME_Y.HIT;
    this.game.player.maxFrame = MAX_FRAME.HIT;
  }
}

export type StateType = {
  state: string;
  handleInput(input: KeyboardEvent['key'][]): void;
  enter(): void;
};
