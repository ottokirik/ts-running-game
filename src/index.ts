import './index.css';

import { Background } from './background';
import { InputHandler } from './input';
import { Player, type PlayerType } from './player';
import {
  ClimbingEnemy,
  FlyingEnemy,
  GroundEnemy,
  type EnemyType,
} from './enemy';
import { UI } from './ui';
import type { ParticleType } from './particle';
import type { CollisionAnimation } from './collision-animation';

export const GAME_FPS = 30;
const GAME_SPEED = 0;
const MAX_SPEED = 6;
const ENEMY_INTERVAL = 1000;
const PARTICLES_LIMIT = 50;

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  canvas.width = 900;
  canvas.height = 500;

  const ctx = canvas.getContext('2d');

  class Game implements GameType {
    groundMargin = 80;
    speed = GAME_SPEED;
    maxSpeed = MAX_SPEED;

    enemies: EnemyType[] = [];
    enemyTimer = 0;
    enemyInterval = ENEMY_INTERVAL;

    lives = 5;

    score = 0;
    time = 0;
    maxTime = 30_000;
    gameOver = false;

    debug = false;

    player: PlayerType;
    inputHandler = new InputHandler(this);
    background = new Background(this);
    ui = new UI(this);
    particles: ParticleType[] = [];
    collisions: CollisionAnimation[] = [];

    constructor(
      public width: number,
      public height: number,
    ) {
      this.player = new Player(this);
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime: number) {
      this.time += deltaTime;

      if (this.time > this.maxTime) {
        this.gameOver = true;
        return this;
      }

      this.background.update();
      this.player.update(this.inputHandler.keys, deltaTime);

      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      for (const enemy of this.enemies) {
        enemy.update(deltaTime);
      }

      for (const particle of this.particles) {
        particle.update();
      }

      if (this.particles.length > PARTICLES_LIMIT) {
        this.particles = this.particles.slice(0, PARTICLES_LIMIT);
      }

      for (const collision of this.collisions) {
        collision.update(deltaTime);
      }

      this.enemies = this.enemies.filter((enemy) => !enemy.markForDeletion);
      this.particles = this.particles.filter(
        (particle) => !particle.markForDeletion,
      );
      this.collisions = this.collisions.filter(
        (collision) => !collision.markForDeletion,
      );

      return this;
    }

    draw(context: CanvasRenderingContext2D) {
      this.background.draw(context);
      this.player.draw(context);

      for (const enemy of this.enemies) {
        enemy.draw(context);
      }

      for (const particle of this.particles) {
        particle.draw(context);
      }

      for (const collision of this.collisions) {
        collision.draw(context);
      }

      this.ui.draw(context);

      return this;
    }

    addEnemy() {
      this.enemies.push(new FlyingEnemy(this));

      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  const animate = (timeStamp: number) => {
    if (ctx === null) return;

    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime).draw(ctx);

    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }
  };

  animate(lastTime);
});

export type GameType = {
  update: (deltaTime: number) => GameType;
  draw: (context: CanvasRenderingContext2D) => GameType;
  height: number;
  width: number;
  groundMargin: number;
  speed: number;
  maxSpeed: number;
  debug: boolean;
  enemies: EnemyType[];
  score: number;
  player: PlayerType;
  particles: ParticleType[];
  collisions: CollisionAnimation[];
  time: number;
  gameOver: boolean;
  lives: number;
};
