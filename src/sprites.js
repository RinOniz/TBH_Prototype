// Procedural Pixel Art Generator for Phaser Textures
// Tạo sprite trực tiếp bằng Canvas API: Hiệp sĩ, Cung thủ, Pháp sư, Quái vật, Boss, VFX

export function generateGameTextures(scene) {
  // ==================== 1. WARRIOR / HIỆP SĨ ====================
  drawPixelTexture(scene, 'hero_run_1', 32, 32, (ctx) => {
    // Helmet
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(10, 4, 12, 10);
    // Plume
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(8, 2, 6, 4);
    // Visor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 8, 5, 2);
    // Body & armor
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(9, 14, 12, 10);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(11, 15, 8, 8);
    // Legs
    ctx.fillStyle = '#475569';
    ctx.fillRect(9, 24, 4, 7);
    ctx.fillRect(16, 23, 4, 6);
    // Broadsword
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(21, 10, 3, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(19, 17, 7, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(21, 19, 3, 4);
  });

  drawPixelTexture(scene, 'hero_run_2', 32, 32, (ctx) => {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(10, 5, 12, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(8, 3, 6, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 9, 5, 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(9, 15, 12, 10);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(11, 16, 8, 8);
    ctx.fillStyle = '#475569';
    ctx.fillRect(11, 23, 4, 6);
    ctx.fillRect(18, 25, 4, 6);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(21, 11, 3, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(19, 18, 7, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(21, 20, 3, 4);
  });

  drawPixelTexture(scene, 'hero_attack', 36, 32, (ctx) => {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(8, 5, 12, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(6, 3, 6, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 9, 5, 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(8, 15, 12, 10);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(10, 16, 8, 8);
    ctx.fillStyle = '#475569';
    ctx.fillRect(7, 24, 5, 7);
    ctx.fillRect(15, 24, 5, 7);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(20, 14, 14, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(32, 13, 4, 5);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(18, 12, 3, 7);
  });

  // ==================== 2. ARCHER / CUNG THỦ ====================
  drawPixelTexture(scene, 'archer_run_1', 32, 32, (ctx) => {
    // Green Hood / Cloak
    ctx.fillStyle = '#15803d';
    ctx.fillRect(10, 4, 12, 8);
    ctx.fillStyle = '#166534';
    ctx.fillRect(8, 7, 4, 8); // Hood drape
    // Face
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(16, 7, 5, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(19, 8, 2, 2); // Eye

    // Leather Tunic
    ctx.fillStyle = '#78350f';
    ctx.fillRect(10, 14, 10, 9);
    ctx.fillStyle = '#22c55e'; // Green sash
    ctx.fillRect(11, 17, 8, 3);

    // Legs
    ctx.fillStyle = '#451a03';
    ctx.fillRect(10, 23, 4, 7);
    ctx.fillRect(16, 22, 4, 6);

    // Wooden Bow in hand
    ctx.fillStyle = '#b45309';
    ctx.fillRect(21, 9, 2, 14);
    ctx.fillRect(20, 8, 3, 2);
    ctx.fillRect(20, 22, 3, 2);
    // Bow string
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(20, 10, 1, 12);
  });

  drawPixelTexture(scene, 'archer_run_2', 32, 32, (ctx) => {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(10, 5, 12, 8);
    ctx.fillStyle = '#166534';
    ctx.fillRect(8, 8, 4, 8);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(16, 8, 5, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(19, 9, 2, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(10, 15, 10, 9);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(11, 18, 8, 3);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(12, 23, 4, 6);
    ctx.fillRect(18, 24, 4, 6);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(21, 10, 2, 14);
    ctx.fillRect(20, 9, 3, 2);
    ctx.fillRect(20, 23, 3, 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(20, 11, 1, 12);
  });

  drawPixelTexture(scene, 'archer_attack', 32, 32, (ctx) => {
    // Drawing the bow
    ctx.fillStyle = '#15803d';
    ctx.fillRect(8, 4, 12, 8);
    ctx.fillStyle = '#166534';
    ctx.fillRect(6, 7, 4, 8);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(14, 7, 6, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(18, 8, 2, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, 14, 11, 9);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(9, 17, 8, 3);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(7, 23, 5, 7);
    ctx.fillRect(15, 23, 5, 7);

    // Drawn Bow curved forward
    ctx.fillStyle = '#b45309';
    ctx.fillRect(24, 8, 2, 16);
    ctx.fillRect(22, 6, 3, 3);
    ctx.fillRect(22, 23, 3, 3);
    // Pulled string
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(22, 7);
    ctx.lineTo(16, 16);
    ctx.lineTo(22, 24);
    ctx.stroke();
    // Nocked arrow
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(16, 15, 11, 2);
    ctx.fillStyle = '#22c55e'; // Fletching
    ctx.fillRect(14, 14, 3, 4);
  });

  // ==================== 3. MAGE / PHÁP SƯ ====================
  drawPixelTexture(scene, 'mage_run_1', 32, 32, (ctx) => {
    // Wizard Hat (Pointy purple hat)
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(14, 1, 4, 4);
    ctx.fillRect(12, 5, 8, 4);
    ctx.fillRect(8, 9, 16, 3);
    ctx.fillStyle = '#f59e0b'; // Hat buckle
    ctx.fillRect(14, 8, 4, 2);

    // Face & Beard
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(14, 11, 6, 5);
    ctx.fillStyle = '#f1f5f9'; // White beard
    ctx.fillRect(13, 14, 7, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(17, 12, 2, 2); // Eye

    // Purple Robe
    ctx.fillStyle = '#6d28d9';
    ctx.fillRect(10, 16, 12, 13);
    ctx.fillStyle = '#a855f7'; // Robe Trim
    ctx.fillRect(15, 16, 2, 13);
    ctx.fillStyle = '#312e81';
    ctx.fillRect(10, 27, 12, 3);

    // Glowing Magic Staff
    ctx.fillStyle = '#78350f'; // Wood
    ctx.fillRect(23, 6, 2, 22);
    // Arcane Orb on top
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(21, 3, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(23, 4, 2, 2);
  });

  drawPixelTexture(scene, 'mage_run_2', 32, 32, (ctx) => {
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(14, 2, 4, 4);
    ctx.fillRect(12, 6, 8, 4);
    ctx.fillRect(8, 10, 16, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(14, 9, 4, 2);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(14, 12, 6, 5);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(13, 15, 7, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(17, 13, 2, 2);
    ctx.fillStyle = '#6d28d9';
    ctx.fillRect(10, 17, 12, 12);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(15, 17, 2, 12);
    ctx.fillStyle = '#312e81';
    ctx.fillRect(10, 27, 12, 3);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(23, 7, 2, 22);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(21, 4, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(23, 5, 2, 2);
  });

  drawPixelTexture(scene, 'mage_attack', 34, 32, (ctx) => {
    // Staff raised forward casting spell
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(12, 2, 4, 4);
    ctx.fillRect(10, 6, 8, 4);
    ctx.fillRect(6, 10, 16, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(12, 9, 4, 2);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(12, 12, 6, 5);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(11, 15, 7, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(15, 13, 2, 2);
    ctx.fillStyle = '#6d28d9';
    ctx.fillRect(8, 17, 12, 12);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(13, 17, 2, 12);
    ctx.fillStyle = '#312e81';
    ctx.fillRect(8, 27, 12, 3);

    // Angled Staff
    ctx.fillStyle = '#78350f';
    ctx.fillRect(20, 10, 10, 3);
    ctx.fillRect(28, 4, 3, 10);
    // Radiant Magic Orb Flare
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(26, 2, 8, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(28, 4, 4, 4);
  });

  // ==================== 4. PROJECTILES & VFX ====================
  // Arrow for Archer
  drawPixelTexture(scene, 'vfx_arrow', 24, 8, (ctx) => {
    // Wooden shaft
    ctx.fillStyle = '#b45309';
    ctx.fillRect(4, 3, 14, 2);
    // Steel tip
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(18, 2, 4, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(22, 3, 2, 2);
    // Green fletching
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 1, 4, 2);
    ctx.fillRect(0, 5, 4, 2);
  });

  // Magic Arcane Orb for Mage
  drawPixelTexture(scene, 'vfx_magic_orb', 16, 16, (ctx) => {
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(8, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7, 7, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Magic Blast Ring
  drawPixelTexture(scene, 'vfx_magic_blast', 32, 32, (ctx) => {
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Sword Slash
  drawPixelTexture(scene, 'vfx_slash', 32, 32, (ctx) => {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(16, 16, 12, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(16, 16, 12, -Math.PI * 0.25, Math.PI * 0.25);
    ctx.stroke();
  });

  // Thunder Strike
  drawPixelTexture(scene, 'vfx_thunder', 24, 48, (ctx) => {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(6, 20);
    ctx.lineTo(13, 20);
    ctx.lineTo(8, 48);
    ctx.lineTo(20, 24);
    ctx.lineTo(13, 24);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(13, 6);
    ctx.lineTo(8, 20);
    ctx.lineTo(12, 20);
    ctx.lineTo(10, 38);
    ctx.lineTo(16, 24);
    ctx.lineTo(12, 24);
    ctx.closePath();
    ctx.fill();
  });

  // Coin
  drawPixelTexture(scene, 'vfx_coin', 16, 16, (ctx) => {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(3, 1, 10, 14);
    ctx.fillRect(1, 3, 14, 10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(3, 3, 10, 10);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(5, 5, 3, 3);
  });

  // Dust
  drawPixelTexture(scene, 'particle_dust', 6, 6, (ctx) => {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(1, 1, 4, 4);
  });

  // ==================== 5. MONSTERS & BOSSES ====================
  // Slime
  drawPixelTexture(scene, 'slime', 28, 24, (ctx) => {
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(4, 8, 20, 14);
    ctx.fillRect(6, 4, 16, 18);
    ctx.fillRect(2, 12, 24, 9);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(6, 6, 4, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, 11, 3, 4);
    ctx.fillRect(17, 11, 3, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 11, 1, 2);
    ctx.fillRect(17, 11, 1, 2);
  });

  // Bat
  drawPixelTexture(scene, 'bat', 28, 22, (ctx) => {
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(2, 6, 8, 8);
    ctx.fillRect(0, 4, 4, 5);
    ctx.fillRect(18, 6, 8, 8);
    ctx.fillRect(24, 4, 4, 5);
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(10, 8, 8, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(11, 11, 2, 2);
    ctx.fillRect(15, 11, 2, 2);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(10, 5, 2, 3);
    ctx.fillRect(16, 5, 2, 3);
  });

  // Skeleton
  drawPixelTexture(scene, 'skeleton', 28, 32, (ctx) => {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(9, 3, 10, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(11, 7, 2, 2);
    ctx.fillRect(15, 7, 2, 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(13, 12, 3, 9);
    ctx.fillRect(10, 14, 9, 2);
    ctx.fillRect(10, 17, 9, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(11, 21, 7, 2);
    ctx.fillRect(10, 23, 3, 8);
    ctx.fillRect(16, 23, 3, 8);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(4, 11, 3, 11);
    ctx.fillRect(3, 9, 5, 4);
  });

  // Goblin
  drawPixelTexture(scene, 'goblin', 28, 28, (ctx) => {
    ctx.fillStyle = '#84cc16';
    ctx.fillRect(2, 7, 4, 4);
    ctx.fillRect(22, 7, 4, 4);
    ctx.fillStyle = '#65a30d';
    ctx.fillRect(6, 6, 16, 11);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(8, 10, 3, 3);
    ctx.fillRect(17, 10, 3, 3);
    ctx.fillStyle = '#000000';
    ctx.fillRect(9, 11, 1, 1);
    ctx.fillRect(18, 11, 1, 1);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, 17, 12, 6);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(9, 23, 4, 5);
    ctx.fillRect(15, 23, 4, 5);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(20, 15, 6, 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(18, 14, 3, 4);
  });

  // Boss Slime
  drawPixelTexture(scene, 'boss_slime', 48, 42, (ctx) => {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(15, 4, 18, 8);
    ctx.fillRect(15, 2, 4, 4);
    ctx.fillRect(22, 0, 4, 5);
    ctx.fillRect(29, 2, 4, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(23, 5, 2, 3);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(6, 15, 36, 24);
    ctx.fillRect(10, 11, 28, 29);
    ctx.fillRect(3, 21, 42, 17);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(9, 14, 6, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 21, 5, 6);
    ctx.fillRect(28, 21, 5, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 22, 2, 3);
    ctx.fillRect(29, 22, 2, 3);
  });

  // Boss Skeleton
  drawPixelTexture(scene, 'boss_skeleton', 48, 52, (ctx) => {
    ctx.fillStyle = '#334155';
    ctx.fillRect(14, 6, 20, 16);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(8, 2, 6, 10);
    ctx.fillRect(34, 2, 6, 10);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(18, 14, 4, 3);
    ctx.fillRect(26, 14, 4, 3);
    ctx.fillStyle = '#475569';
    ctx.fillRect(10, 22, 28, 16);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(18, 24, 12, 12);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(14, 38, 7, 13);
    ctx.fillRect(27, 38, 7, 13);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(38, 14, 8, 18);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(40, 10, 4, 36);
  });

  // Boss Dragon
  drawPixelTexture(scene, 'boss_dragon', 52, 48, (ctx) => {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(10, 12, 34, 26);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(24, 16, 24, 18);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(12, 4, 6, 10);
    ctx.fillRect(20, 2, 6, 10);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(30, 18, 5, 4);
    ctx.fillStyle = '#000000';
    ctx.fillRect(32, 19, 2, 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(36, 30, 3, 4);
    ctx.fillRect(42, 30, 3, 4);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(14, 28, 12, 12);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(16, 30, 8, 8);
  });
}

function drawPixelTexture(scene, key, width, height, drawFn) {
  if (scene.textures.exists(key)) return;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  drawFn(ctx);

  scene.textures.addCanvas(key, canvas);
}
