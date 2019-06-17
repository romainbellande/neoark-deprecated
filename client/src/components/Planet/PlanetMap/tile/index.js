import { Graphics } from 'pixi.js';

const tiles = [
  {
    type: 'metal',
    color: '0x41545a',
  },
  {
    type: 'metal_miner',
    color: '0x767e82',
    interactive: true,
  },
];

const tile = ({ id, app, type, x, y, onClick }) => {
  const rectangle = new Graphics();
  const tileItem = tiles.find(item => item.type === type);
  const tileSize = 40;
  if (!tileItem) {
    throw new Error(`type ${type} not found !`);
  }
  rectangle.lineStyle(1, '0x555c5f', 1);

  if (tileItem.interactive) {
    rectangle.interactive = true;
    rectangle.on('pointerdown', () => {
      onClick(id);
    });
  }

  rectangle.beginFill(tileItem.color);
  rectangle.drawRect(x * tileSize, y * tileSize, tileSize, tileSize);
  rectangle.endFill();
  app.stage.addChild(rectangle);
  return null;
};

export default tile;
