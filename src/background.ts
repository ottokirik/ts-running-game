import type { GameType } from '.';

import layer1Img from '../static/assets/layer-1.png';
import layer2Img from '../static/assets/layer-2.png';
import layer3Img from '../static/assets/layer-3.png';
import layer4Img from '../static/assets/layer-4.png';
import layer5Img from '../static/assets/layer-5.png';

const layer1 = new Image();
layer1.src = layer1Img;

const layer2 = new Image();
layer2.src = layer2Img;

const layer3 = new Image();
layer3.src = layer3Img;

const layer4 = new Image();
layer4.src = layer4Img;

const layer5 = new Image();
layer5.src = layer5Img;

class Layer implements LayerType {
  x = 0;
  y = 0;

  constructor(
    public game: GameType,
    public width: number,
    public height: number,
    public speedModifier: number,
    public image: HTMLImageElement,
  ) {}

  update(): void {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height,
    );
  }
}

export class Background {
  width = 1667;
  height = 500;

  layer1Image = layer1;
  layer2Image = layer2;
  layer3Image = layer3;
  layer4Image = layer4;
  layer5Image = layer5;

  layer1: LayerType;
  layer2: LayerType;
  layer3: LayerType;
  layer4: LayerType;
  layer5: LayerType;

  backgroundLayers: LayerType[];

  constructor(public game: GameType) {
    this.layer1 = new Layer(game, this.width, this.height, 0, this.layer1Image);
    this.layer2 = new Layer(
      game,
      this.width,
      this.height,
      0.2,
      this.layer2Image,
    );
    this.layer3 = new Layer(
      game,
      this.width,
      this.height,
      0.4,
      this.layer3Image,
    );
    this.layer4 = new Layer(
      game,
      this.width,
      this.height,
      0.8,
      this.layer4Image,
    );
    this.layer5 = new Layer(game, this.width, this.height, 1, this.layer5Image);

    this.backgroundLayers = [
      this.layer1,
      this.layer2,
      this.layer3,
      this.layer4,
      this.layer5,
    ];
  }

  draw(context: CanvasRenderingContext2D) {
    for (const layer of this.backgroundLayers) {
      layer.draw(context);
    }
  }

  update() {
    for (const layer of this.backgroundLayers) {
      layer.update();
    }
  }
}

type LayerType = {
  update(): void;
  draw(context: CanvasRenderingContext2D): void;
};
