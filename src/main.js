import Phaser from 'phaser';
import { GameScene } from './gameScene.js';
import { gameState } from './state.js';
import { UIManager } from './ui.js';

// Cấu hình Phaser Game
const container = document.getElementById('game-container');
const initialWidth = container ? container.clientWidth || 700 : 700;
const initialHeight = container ? container.clientHeight || 320 : 320;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: initialWidth,
  height: initialHeight,
  backgroundColor: '#0f172a',
  pixelArt: true, // Giữ pixel art sắc nét, không bị nhòe (tương tự Point filter trong Unity Sprite Import Settings)
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [GameScene]
};

// Khởi chạy game
const game = new Phaser.Game(config);

// Khởi tạo UI Controller quản lý DOM Overlays
const ui = new UIManager(game);

// Tự động lưu game định kỳ mỗi 5 giây (Auto-save)
setInterval(() => {
  gameState.save();
}, 5000);

// Xử lý resize cửa sổ mượt mà
window.addEventListener('resize', () => {
  if (container && game) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    game.scale.resize(w, h);
  }
});

console.log('⚔️ TaskBar Hero Web Edition đã khởi động thành công!');