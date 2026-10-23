import Phaser from 'phaser';
import { gameState } from './state.js';
import { sounds } from './audio.js';
import { generateGameTextures } from './sprites.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.hero = null;
    this.waveMonsters = []; // Danh sách quái vật trong wave hiện tại
    this.isAttacking = false;
    this.heroState = 'RUNNING'; // 'RUNNING', 'FIGHTING', 'DEFEATED'
    this.attackTimer = 0;
    this.regenTimer = 0;
    this.walkAnimTimer = 0;
    this.walkFrame = 1;
    this.groundTiles = [];
    this.spawnWaveTimer = null;
    this.defeatTimer = null;
    this.activeProjectiles = [];
  }

  getHeroPrefix() {
    return gameState.activeCharMeta ? gameState.activeCharMeta.spritePrefix : 'hero';
  }

  create() {
    // 1. Tạo textures pixel art từ canvas
    generateGameTextures(this);

    const { width, height } = this.scale;
    this.groundY = height - 28;

    // 2. Vẽ nền Parallax (Bầu trời đêm & Ngọn núi xa xa)
    this.createBackground(width, height);

    // 3. Đường chạy (Ground Tiles)
    this.createGround(width, height);

    // 4. Tạo Hero
    this.createHero(width);

    // 5. Spawn Wave quái vật đầu tiên (Wave 1/10)
    this.spawnNextWave();

    // 6. Tương tác Click / Tap để gọi sấm sét hỗ trợ
    this.input.on('pointerdown', (pointer) => {
      this.handlePlayerClick(pointer);
    });

    // 7. Lắng nghe thay đổi kích thước khi toggle Taskbar mode
    this.scale.on('resize', (gameSize) => {
      this.handleResize(gameSize.width, gameSize.height);
    });

    // 8. Đăng ký nhận sự kiện kỹ năng từ State/UI
    window.addEventListener('use-skill-active', (e) => this.handleClassSkill(e.detail));

    // 9. Lắng nghe yêu cầu đổi ải từ bảng Map
    window.addEventListener('stage-selected', () => {
      this.resetCombatForNewStage();
    });

    // 10. Lắng nghe chuyển đổi nhân vật (Warrior, Archer, Mage)
    window.addEventListener('character-switched', () => {
      this.updateHeroAppearance();
    });
  }

  resetCombatForNewStage() {
    if (this.spawnWaveTimer) {
      this.spawnWaveTimer.remove(false);
      this.spawnWaveTimer = null;
    }
    if (this.defeatTimer) {
      this.defeatTimer.remove(false);
      this.defeatTimer = null;
    }

    // Xoá tất cả đạn/cầu phép đang bay
    if (this.activeProjectiles && this.activeProjectiles.length > 0) {
      for (const p of this.activeProjectiles) {
        if (p && p.destroy) p.destroy();
      }
      this.activeProjectiles = [];
    }

    // Xoá toàn bộ quái cũ của wave trước
    this.clearAllWaveMonsters();

    // Đưa Hero về vị trí chuẩn
    if (this.hero) {
      this.tweens.killTweensOf(this.hero);
      this.hero.x = this.heroX;
      this.hero.y = this.heroY;
      this.hero.angle = 0;
      this.hero.alpha = 1;
      const prefix = this.getHeroPrefix();
      this.hero.setTexture(`${prefix}_run_1`);
    }

    this.attackTimer = 0;
    this.heroState = 'RUNNING';

    // Sinh wave quái mới
    this.spawnNextWave();
  }

  clearAllWaveMonsters() {
    if (this.waveMonsters && this.waveMonsters.length > 0) {
      for (const mob of this.waveMonsters) {
        if (mob.sprite) {
          this.tweens.killTweensOf(mob.sprite);
          if (mob.sprite.destroy) mob.sprite.destroy();
        }
        if (mob.hpBar && mob.hpBar.destroy) {
          mob.hpBar.clear();
          mob.hpBar.destroy();
        }
      }
      this.waveMonsters = [];
    }
  }

  createBackground(width, height) {
    this.skyBg = this.add.graphics();
    this.mountainBg = this.add.graphics();
    this.treesBg = this.add.graphics();
    this.drawSky(width, height);
    this.drawMountains(width, height);
    this.drawTrees(width, height);
  }

  drawSky(width, height) {
    this.skyBg.clear();
    const stage = gameState.data.stage;

    let topColor = 0x0f172a;
    let botColor = 0x1e1b4b;

    if (stage === 2) {
      topColor = 0x170b2c;
      botColor = 0x3b0764;
    } else if (stage >= 3) {
      topColor = 0x2a0808;
      botColor = 0x450a0a;
    }

    this.skyBg.fillGradientStyle(topColor, topColor, botColor, botColor, 1);
    this.skyBg.fillRect(0, 0, width, height);

    this.skyBg.fillStyle(stage >= 3 ? 0xf97316 : 0xffffff, 0.6);
    for (let i = 0; i < 35; i++) {
      const sx = (i * 47) % width;
      const sy = (i * 29) % (height * 0.55);
      this.skyBg.fillRect(sx, sy, (i % 3 === 0) ? 2 : 1, (i % 3 === 0) ? 2 : 1);
    }
  }

  drawMountains(width, height) {
    this.mountainBg.clear();
    const stage = gameState.data.stage;
    let mountainColor = 0x1e293b;

    if (stage === 2) mountainColor = 0x2e1065;
    else if (stage >= 3) mountainColor = 0x3f1212;

    this.mountainBg.fillStyle(mountainColor, 0.7);
    this.mountainBg.beginPath();
    this.mountainBg.moveTo(0, height * 0.7);

    const step = 80;
    for (let x = 0; x <= width + step; x += step) {
      const peakY = height * 0.35 + ((x * 13) % 45);
      this.mountainBg.lineTo(x + step * 0.5, peakY);
      this.mountainBg.lineTo(x + step, height * 0.7);
    }
    this.mountainBg.lineTo(width, height);
    this.mountainBg.lineTo(0, height);
    this.mountainBg.closePath();
    this.mountainBg.fill();
  }

  drawTrees(width, height) {
    this.treesBg.clear();
    const stage = gameState.data.stage;
    let foliageColor = 0x0f291e;

    if (stage === 2) foliageColor = 0x1f1438;
    else if (stage >= 3) foliageColor = 0x2e0808;

    this.treesBg.fillStyle(foliageColor, 0.85);

    const ground = this.groundY;
    const treeSpacing = 40;
    for (let x = 0; x < width + 50; x += treeSpacing) {
      const treeH = 35 + ((x * 7) % 25);
      this.treesBg.beginPath();
      this.treesBg.moveTo(x, ground);
      this.treesBg.lineTo(x + 12, ground - treeH);
      this.treesBg.lineTo(x + 24, ground);
      this.treesBg.closePath();
      this.treesBg.fill();
    }
  }

  createGround(width, height) {
    this.groundGraphics = this.add.graphics();
    this.groundY = height - 28;
    this.groundOffset = 0;
    this.drawGroundPath(width);
  }

  drawGroundPath(width) {
    this.groundGraphics.clear();
    const gY = this.groundY;
    const stage = gameState.data.stage;

    let pathBaseColor = 0x334155;
    let pathBorderColor = 0x15803d;

    if (stage === 2) {
      pathBaseColor = 0x1e1b4b;
      pathBorderColor = 0x7c3aed;
    } else if (stage >= 3) {
      pathBaseColor = 0x1c1917;
      pathBorderColor = 0xea580c;
    }

    this.groundGraphics.fillStyle(pathBaseColor, 1);
    this.groundGraphics.fillRect(0, gY, width, 28);

    this.groundGraphics.fillStyle(pathBorderColor, 1);
    this.groundGraphics.fillRect(0, gY, width, 4);

    this.groundGraphics.fillStyle(0x0f172a, 0.7);
    for (let x = -40; x < width + 40; x += 32) {
      const posX = ((x - (this.groundOffset % 32)) + width + 40) % (width + 40) - 20;
      this.groundGraphics.fillRect(posX, gY + 8, 18, 6);
      this.groundGraphics.fillRect(posX + 10, gY + 18, 14, 5);
    }
  }

  updateWorldBiome() {
    const { width, height } = this.scale;
    this.drawSky(width, height);
    this.drawMountains(width, height);
    this.drawTrees(width, height);
    this.drawGroundPath(width);
  }

  createHero(width) {
    this.heroX = Math.min(120, width * 0.22);
    this.heroY = this.groundY - 6;

    const prefix = this.getHeroPrefix();
    this.hero = this.add.sprite(this.heroX, this.heroY, `${prefix}_run_1`);
    this.hero.setOrigin(0.5, 0.9);
    this.hero.setScale(1.85);

    // Aura Frenzy
    this.frenzyAura = this.add.circle(this.heroX, this.heroY - 18, 22, 0xef4444, 0.25);
    this.frenzyAura.setVisible(false);
  }

  updateHeroAppearance() {
    if (!this.hero) return;
    const prefix = this.getHeroPrefix();
    this.hero.setTexture(`${prefix}_run_1`);

    // Hiệu ứng hạt sáng khi đổi Class
    const meta = gameState.activeCharMeta;
    this.showCombatText(this.hero.x, this.hero.y - 50, `${meta.avatar} ${meta.name}!`, meta.color, 1.3);

    for (let i = 0; i < 8; i++) {
      const p = this.add.circle(this.hero.x + (Math.random() * 30 - 15), this.hero.y - 20, 3, 0xfbbf24, 0.9);
      this.tweens.add({
        targets: p,
        y: p.y - 30,
        x: p.x + (Math.random() * 20 - 10),
        alpha: 0,
        duration: 400,
        onComplete: () => p.destroy()
      });
    }
  }

  // ==================== SPAWN WAVE QUÁI VẬT (NHIỀU CON MỖI WAVE) ====================
  spawnNextWave() {
    this.clearAllWaveMonsters();
    this.updateWorldBiome();

    const monsterDataList = gameState.spawnMonsterWave();
    const { width } = this.scale;
    const currentWave = gameState.data.currentWave || 1;
    const isBossWave = (currentWave === 10);

    const isSingleBoss = monsterDataList.length === 1 && monsterDataList[0].isBoss;

    // Vị trí xuất hiện của bầy quái (Front monster cách hero một đoạn hợp lý)
    const frontX = Math.min(360, width * 0.52);
    const spacing = isSingleBoss ? 0 : Math.min(58, Math.max(38, (width - frontX - 80) / Math.max(1, monsterDataList.length - 1)));

    if (isBossWave) {
      this.cameras.main.shake(180, 0.01);
      const boss = monsterDataList[0];
      this.showCombatText(width * 0.55, this.groundY - 75, `👑 ${boss.name}! 👑`, '#ef4444', 1.4);
    } else {
      this.showCombatText(width * 0.52, this.groundY - 60, `⚔️ WAVE ${currentWave}/10 (${monsterDataList.length} Quái)`, '#38bdf8', 1.15);
    }

    this.waveMonsters = [];

    monsterDataList.forEach((data, i) => {
      const targetX = isSingleBoss ? (width - 160) : (frontX + i * spacing);
      const startX = width + 50 + (i * 35);
      const offsetY = isSingleBoss ? 0 : ((i % 2 === 0) ? -4 : 4);
      const enemyY = this.groundY - 6 + offsetY;

      const textureKey = data.type || 'slime';
      const sprite = this.add.sprite(startX, enemyY, textureKey);
      sprite.setOrigin(0.5, 0.9);

      // Kích thước quái: Boss to lớn (2.1x), Elite (1.8x), thường (1.6x)
      let scale = data.isBoss ? 2.15 : (data.isElite ? 1.85 : 1.6);
      sprite.setScale(scale);

      const hpBar = this.add.graphics();

      const mobObj = {
        id: data.id || `mob_${i}_${Date.now()}`,
        data,
        sprite,
        hpBar,
        baseX: targetX,
        baseY: enemyY,
        attackTimer: Math.random() * 600
      };

      this.waveMonsters.push(mobObj);

      // Animation di chuyển vào đội hình
      this.tweens.add({
        targets: sprite,
        x: targetX,
        duration: 400 + i * 80,
        ease: 'Power1',
        onComplete: () => {
          if (i === 0) {
            this.heroState = 'FIGHTING';
          }
        }
      });
    });

    this.heroState = 'RUNNING';
  }

  // Lấy con quái còn sống đứng đầu hàng
  getFrontMonster() {
    return this.waveMonsters.find((m) => m && m.data && m.data.currentHp > 0) || null;
  }

  // Lấy tất cả quái còn sống trong wave
  getAliveMonsters() {
    return this.waveMonsters.filter((m) => m && m.data && m.data.currentHp > 0);
  }

  update(time, delta) {
    const { width } = this.scale;

    // 1. Tự động hồi phục máu theo giây
    this.regenTimer += delta;
    if (this.regenTimer >= 1000) {
      this.regenTimer = 0;
      if (gameState.currentHp > 0 && gameState.currentHp < gameState.maxHp) {
        gameState.currentHp = Math.min(gameState.maxHp, gameState.currentHp + gameState.hpRegen);
        gameState.notify();
      }
    }

    // 2. Aura Frenzy
    const isFrenzy = gameState.isFrenzyActive;
    this.frenzyAura.setVisible(isFrenzy);
    if (isFrenzy && this.hero) {
      this.frenzyAura.x = this.hero.x;
      this.frenzyAura.y = this.hero.y - 20;
    }

    // 3. Trạng thái Hero
    const prefix = this.getHeroPrefix();
    if (this.heroState === 'RUNNING') {
      this.groundOffset += (delta * 0.18);
      this.drawGroundPath(width);

      this.walkAnimTimer += delta;
      if (this.walkAnimTimer > 150) {
        this.walkAnimTimer = 0;
        this.walkFrame = this.walkFrame === 1 ? 2 : 1;
        if (this.hero) this.hero.setTexture(`${prefix}_run_${this.walkFrame}`);

        if (Math.random() < 0.4 && this.hero) {
          this.createDustParticle(this.hero.x - 14, this.hero.y);
        }
      }
    } else if (this.heroState === 'FIGHTING') {
      const aliveList = this.getAliveMonsters();
      if (aliveList.length === 0) {
        return;
      }

      // Hero tự đánh quái hàng đầu theo tốc độ đánh
      const attackInterval = 1000 / gameState.attackSpeed;
      this.attackTimer += delta;

      if (this.attackTimer >= attackInterval) {
        this.attackTimer = 0;
        this.heroAttack();
      }

      // Từng quái vật còn sống tấn công Hero theo tốc độ riêng của nó
      for (const mob of aliveList) {
        mob.attackTimer = (mob.attackTimer || 0) + delta;
        if (mob.attackTimer >= mob.data.attackSpeedMs) {
          mob.attackTimer = 0;
          this.singleMonsterAttack(mob);
        }
      }
    }

    this.updateAllHpBars();
  }

  // ==================== TẤN CÔNG CỦA HERO (WARRIOR / ARCHER / MAGE) ====================
  heroAttack() {
    const target = this.getFrontMonster();
    if (!target || !target.sprite) return;

    const charId = gameState.activeCharId;
    const prefix = this.getHeroPrefix();

    if (charId === 'warrior') {
      // CHIẾN BINH: Chém cận chiến. Nếu có Cuồng nộ thì chém lan 2 con đầu hàng!
      this.hero.setTexture(`${prefix}_attack`);
      sounds.playSlash();

      this.tweens.add({
        targets: this.hero,
        x: this.heroX + 18,
        duration: 65,
        yoyo: true,
        onComplete: () => {
          this.hero.setTexture(`${prefix}_run_1`);
        }
      });

      const slash = this.add.sprite(target.sprite.x - 15, target.sprite.y - 25, 'vfx_slash');
      slash.setScale(1.8);
      this.tweens.add({
        targets: slash,
        alpha: 0,
        scaleX: 2.2,
        scaleY: 2.2,
        duration: 200,
        onComplete: () => slash.destroy()
      });

      this.applyDamageToMonster(target, 1.0);

      // Nếu đang bật Cuồng Nộ (Frenzy), chém lan thêm quái thứ 2
      if (gameState.isFrenzyActive) {
        const alive = this.getAliveMonsters();
        if (alive.length > 1 && alive[1]) {
          this.applyDamageToMonster(alive[1], 0.6);
        }
      }

    } else if (charId === 'archer') {
      // CUNG THỦ: Bắn tên tầm xa
      this.hero.setTexture(`${prefix}_attack`);
      sounds.playArrowShoot();

      this.time.delayedCall(80, () => {
        this.hero.setTexture(`${prefix}_run_1`);
      });

      const arrow = this.add.sprite(this.hero.x + 16, this.hero.y - 18, 'vfx_arrow');
      arrow.setScale(1.5);
      this.activeProjectiles.push(arrow);

      const targetX = target.sprite.x - 10;
      const targetY = target.sprite.y - 20;

      this.tweens.add({
        targets: arrow,
        x: targetX,
        y: targetY,
        duration: 120,
        ease: 'Linear',
        onComplete: () => {
          this.activeProjectiles = this.activeProjectiles.filter((p) => p !== arrow);
          if (arrow && arrow.destroy) arrow.destroy();
          sounds.playArrowHit();
          this.createDustParticle(targetX, targetY);
          this.applyDamageToMonster(target, 1.0);
        }
      });

    } else if (charId === 'mage') {
      // PHÁP SƯ: Phóng cầu ma pháp, nổ lan 35% sát thương sang quái kế bên!
      this.hero.setTexture(`${prefix}_attack`);
      sounds.playMagicCast();

      this.time.delayedCall(120, () => {
        this.hero.setTexture(`${prefix}_run_1`);
      });

      const orb = this.add.sprite(this.hero.x + 20, this.hero.y - 24, 'vfx_magic_orb');
      orb.setScale(1.6);
      this.activeProjectiles.push(orb);

      const targetX = target.sprite.x - 5;
      const targetY = target.sprite.y - 25;

      this.tweens.add({
        targets: orb,
        x: targetX,
        y: targetY,
        duration: 160,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.activeProjectiles = this.activeProjectiles.filter((p) => p !== orb);
          if (orb && orb.destroy) orb.destroy();
          sounds.playMagicExplode();

          const blast = this.add.sprite(targetX, targetY, 'vfx_magic_blast');
          blast.setScale(1.6);
          this.tweens.add({
            targets: blast,
            scaleX: 2.6,
            scaleY: 2.6,
            alpha: 0,
            duration: 220,
            onComplete: () => blast.destroy()
          });

          this.applyDamageToMonster(target, 1.0);

          // Sát thương nổ lan cho quái lân cận
          const alive = this.getAliveMonsters();
          alive.forEach((m) => {
            if (m !== target && Math.abs(m.sprite.x - targetX) < 80) {
              this.applyDamageToMonster(m, 0.4);
            }
          });
        }
      });
    }
  }

  applyDamageToMonster(mob, multiplier = 1.0) {
    if (!mob || !mob.sprite || mob.data.currentHp <= 0) return;

    const isCrit = Math.random() * 100 < gameState.critChance;
    let dmg = Math.round(gameState.damage * multiplier);

    if (isCrit) {
      dmg = Math.round(dmg * gameState.critDamageMult);
      sounds.playCrit();
      this.showCombatText(mob.sprite.x, mob.sprite.y - 45, `CRIT! ${dmg}`, '#fde047', 1.35);
    } else {
      sounds.playHit();
      this.showCombatText(mob.sprite.x, mob.sprite.y - 38, `-${dmg}`, '#f87171');
    }

    this.damageMonster(mob, dmg);
  }

  damageMonster(mob, amount) {
    if (!mob || mob.data.currentHp <= 0) return;

    mob.data.currentHp = Math.max(0, mob.data.currentHp - amount);

    // Hiệu ứng giật lùi nhẹ khi trúng đòn
    this.tweens.add({
      targets: mob.sprite,
      x: mob.sprite.x + 8,
      duration: 50,
      yoyo: true
    });

    if (mob.data.currentHp <= 0) {
      this.killMonster(mob);
    }
  }

  // Quái vật tấn công Hero
  singleMonsterAttack(mob) {
    if (!mob || !mob.sprite || mob.data.currentHp <= 0 || gameState.currentHp <= 0) return;

    this.tweens.add({
      targets: mob.sprite,
      x: mob.sprite.x - 14,
      duration: 70,
      yoyo: true
    });

    const enemyDmg = mob.data.damage || 2;
    gameState.currentHp = Math.max(0, gameState.currentHp - enemyDmg);
    gameState.notify();

    sounds.playHit();

    if (this.hero) {
      this.tweens.add({
        targets: this.hero,
        alpha: 0.35,
        duration: 80,
        yoyo: true
      });
      this.showCombatText(this.hero.x, this.hero.y - 38, `-${enemyDmg}`, '#ef4444');
    }

    if (gameState.currentHp <= 0) {
      this.handleHeroDefeat();
    }
  }

  killMonster(mob) {
    const deadSprite = mob.sprite;
    const enemyInfo = mob.data;

    const earnedGold = gameState.addGold(enemyInfo.gold);
    const leveledUp = gameState.addExp(enemyInfo.exp);

    sounds.playCoin();
    this.spawnCoinFly(deadSprite.x, deadSprite.y - 18, earnedGold);
    this.showCombatText(deadSprite.x + 10, deadSprite.y - 30, `+${enemyInfo.exp} EXP`, '#38bdf8');

    // Tỉ lệ rớt trang bị vào túi đồ
    const droppedItem = gameState.dropLootMonster(
      enemyInfo.isBoss,
      gameState.data.stage,
      gameState.data.subStage,
      gameState.data.currentWave
    );
    if (droppedItem) {
      this.showCombatText(deadSprite.x, deadSprite.y - 50, `🎁 ${droppedItem.name}!`, '#fbbf24', 1.25);
    }

    if (leveledUp) {
      sounds.playLevelUp();
      this.showCombatText(this.hero.x, this.hero.y - 50, '⭐ LEVEL UP! ⭐', '#fbbf24', 1.4);
    }

    // Xoá thanh HP của quái này ngay lập tức
    if (mob.hpBar) {
      mob.hpBar.clear();
      mob.hpBar.destroy();
      mob.hpBar = null;
    }

    // Animation tử trận
    this.tweens.add({
      targets: deadSprite,
      alpha: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      angle: 90,
      duration: 300,
      onComplete: () => {
        if (deadSprite && deadSprite.destroy) deadSprite.destroy();

        // Xoá khỏi danh sách waveMonsters
        this.waveMonsters = this.waveMonsters.filter((m) => m !== mob);

        // Kiểm tra xem đã quét sạch wave chưa
        const alive = this.getAliveMonsters();
        if (alive.length === 0) {
          this.handleWaveCleared();
        }
      }
    });
  }

  // ==================== QUÉT SẠCH 1 WAVE QUÁI VẬT ====================
  handleWaveCleared() {
    this.heroState = 'RUNNING';

    const advanceResult = gameState.advanceWave(1);

    if (advanceResult.type === 'NEXT_WORLD') {
      sounds.playLevelUp();
      this.showCombatText(this.scale.width * 0.5, this.groundY - 65, '👑 CHIẾN THẮNG THẾ GIỚI! TIẾN VÀO THẾ GIỚI MỚI 👑', '#fbbf24', 1.4);
      this.updateWorldBiome();
      this.spawnWaveTimer = this.time.delayedCall(800, () => {
        this.spawnWaveTimer = null;
        this.spawnNextWave();
      });
    } else if (advanceResult.type === 'NEXT_SUBSTAGE') {
      sounds.playLevelUp();
      this.showCombatText(this.scale.width * 0.5, this.groundY - 60, `🏆 HẠ BOSS ẢI! TIẾN VÀO ẢI ${advanceResult.stage}-${advanceResult.subStage} 🏆`, '#fde047', 1.35);
      this.spawnWaveTimer = this.time.delayedCall(650, () => {
        this.spawnWaveTimer = null;
        this.spawnNextWave();
      });
    } else {
      // Qua Wave tiếp theo (ví dụ Wave 1 -> Wave 2... -> Wave 10)
      this.spawnWaveTimer = this.time.delayedCall(450, () => {
        this.spawnWaveTimer = null;
        this.spawnNextWave();
      });
    }
  }

  handleHeroDefeat() {
    this.heroState = 'DEFEATED';
    const defeatResult = gameState.handleHeroDefeat();

    if (defeatResult.action === 'RETREAT_TO_WAVE_9') {
      this.showCombatText(this.hero.x, this.hero.y - 55, '💀 THUA BOSS! LÙI VỀ WAVE 9 TREO MÁY', '#f87171', 1.35);
    } else {
      this.showCombatText(this.hero.x, this.hero.y - 45, '🔄 HỒI SINH VÀ THỬ LẠI WAVE NÀY...', '#94a3b8', 1.15);
    }

    this.tweens.add({
      targets: this.hero,
      angle: 90,
      alpha: 0.5,
      duration: 400
    });

    this.defeatTimer = this.time.delayedCall(1600, () => {
      this.defeatTimer = null;
      if (this.hero) {
        this.tweens.add({
          targets: this.hero,
          angle: 0,
          alpha: 1,
          duration: 300,
          onComplete: () => {
            this.spawnNextWave();
          }
        });
      }
    });
  }

  // Tap / Click chuột giáng sấm sét hỗ trợ
  handlePlayerClick(pointer) {
    const target = this.getFrontMonster();
    if (!target || !target.sprite || target.data.currentHp <= 0) return;

    const targetX = target.sprite.x;
    const targetY = target.sprite.y - 20;

    sounds.playThunder();

    const bolt = this.add.sprite(targetX, targetY - 25, 'vfx_thunder');
    bolt.setScale(1.6);
    this.tweens.add({
      targets: bolt,
      alpha: 0,
      scaleY: 2.2,
      duration: 220,
      onComplete: () => bolt.destroy()
    });

    this.cameras.main.shake(80, 0.005);
    const tapDmg = gameState.clickDamage;
    this.damageMonster(target, tapDmg);
    this.showCombatText(targetX, targetY - 45, `⚡ ${tapDmg}`, '#38bdf8', 1.15);
  }

  // ==================== KỸ NĂNG CHỦ ĐỘNG ====================
  handleClassSkill(skillKey) {
    const aliveMonsters = this.getAliveMonsters();
    if (aliveMonsters.length === 0) return;
    const charId = gameState.activeCharId;

    if (skillKey === 'skill1') {
      // Skill 1: Buff (Cuồng nộ / Bắn nhanh / Tụ phép)
      sounds.playSlash();
      const text = charId === 'warrior' ? '🔥 CUỒNG NỘ!' : charId === 'archer' ? '💨 BẮN NHANH!' : '✨ TỤ PHÉP!';
      this.showCombatText(this.hero.x, this.hero.y - 40, text, '#ef4444', 1.3);

    } else if (skillKey === 'skill2') {
      // Skill 2: AOE TẤN CÔNG TOÀN BỘ QUÁI TRÊN MÀN HÌNH!
      if (charId === 'warrior') {
        // THIÊN LÔI: Giáng sấm chớp đánh vào tất cả quái vật
        sounds.playThunder();
        this.cameras.main.shake(250, 0.015);
        const aoeDmg = Math.round(gameState.damage * 3.5);

        aliveMonsters.forEach((mob, i) => {
          this.time.delayedCall(i * 70, () => {
            if (mob && mob.sprite && mob.data.currentHp > 0) {
              const bolt = this.add.sprite(mob.sprite.x, mob.sprite.y - 30, 'vfx_thunder');
              bolt.setScale(2.0);
              this.tweens.add({ targets: bolt, alpha: 0, duration: 240, onComplete: () => bolt.destroy() });
              this.damageMonster(mob, aoeDmg);
              this.showCombatText(mob.sprite.x, mob.sprite.y - 50, `⚡ ${aoeDmg}`, '#fde047', 1.3);
            }
          });
        });

      } else if (charId === 'archer') {
        // MƯA TÊN: Bão tên trút xuống toàn bộ quái vật
        sounds.playArrowShoot();
        this.cameras.main.shake(200, 0.01);
        const aoeDmg = Math.round(gameState.damage * 4.0);

        aliveMonsters.forEach((mob, i) => {
          this.time.delayedCall(i * 60, () => {
            if (mob && mob.sprite && mob.data.currentHp > 0) {
              const arr = this.add.sprite(mob.sprite.x, -10, 'vfx_arrow');
              arr.angle = 90;
              arr.setScale(1.6);
              this.tweens.add({
                targets: arr,
                y: mob.sprite.y - 15,
                duration: 140,
                onComplete: () => {
                  arr.destroy();
                  sounds.playArrowHit();
                  this.damageMonster(mob, aoeDmg);
                  this.showCombatText(mob.sprite.x, mob.sprite.y - 45, `🏹 ${aoeDmg}`, '#4ade80', 1.3);
                }
              });
            }
          });
        });

      } else if (charId === 'mage') {
        // THIÊN THẠCH: Khổng lồ rơi từ trời nổ tung toàn bộ quái vật
        sounds.playMagicExplode();
        this.cameras.main.shake(320, 0.02);

        const centerTarget = aliveMonsters[Math.floor(aliveMonsters.length / 2)];
        const targetX = centerTarget ? centerTarget.sprite.x : this.scale.width * 0.6;

        const meteor = this.add.circle(targetX - 40, -20, 24, 0xf97316, 1);
        this.tweens.add({
          targets: meteor,
          x: targetX,
          y: this.groundY - 30,
          duration: 250,
          ease: 'Quad.easeIn',
          onComplete: () => {
            meteor.destroy();
            const blast = this.add.sprite(targetX, this.groundY - 30, 'vfx_magic_blast');
            blast.setScale(3.8);
            this.tweens.add({ targets: blast, alpha: 0, duration: 300, onComplete: () => blast.destroy() });

            const aoeDmg = Math.round(gameState.damage * 4.5);
            aliveMonsters.forEach((mob) => {
              this.damageMonster(mob, aoeDmg);
              this.showCombatText(mob.sprite.x, mob.sprite.y - 50, `☄️ ${aoeDmg}`, '#fb923c', 1.4);
            });
          }
        });
      }

    } else if (skillKey === 'skill3') {
      // Skill 3: Hồi phục / Tiện ích
      sounds.playHeal();
      if (charId === 'warrior') {
        this.showCombatText(this.hero.x, this.hero.y - 40, `+50% HP!`, '#4ade80', 1.3);
      } else if (charId === 'archer') {
        this.showCombatText(this.hero.x, this.hero.y - 40, `🎯 MẮT ĐẠI BÀNG!`, '#fbbf24', 1.3);
      } else if (charId === 'mage') {
        this.showCombatText(this.hero.x, this.hero.y - 40, `❄️ KHIÊN BĂNG!`, '#38bdf8', 1.3);
      }

      for (let i = 0; i < 6; i++) {
        const p = this.add.circle(this.hero.x + (Math.random() * 24 - 12), this.hero.y, 4, 0x22c55e, 0.8);
        this.tweens.add({
          targets: p,
          y: p.y - 45,
          alpha: 0,
          duration: 500,
          onComplete: () => p.destroy()
        });
      }
    }
  }

  spawnCoinFly(startX, startY, amount) {
    const coin = this.add.sprite(startX, startY, 'vfx_coin');
    coin.setScale(1.5);

    this.tweens.add({
      targets: coin,
      y: startY - 35,
      x: startX - 25,
      alpha: 0,
      scaleX: 1.8,
      scaleY: 1.8,
      duration: 650,
      onComplete: () => coin.destroy()
    });

    this.showCombatText(startX - 15, startY - 15, `+${amount} 💰`, '#f59e0b', 1.1);
  }

  showCombatText(x, y, text, color = '#ffffff', scale = 1.0) {
    const txt = this.add.text(x, y, text, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: color,
      stroke: '#000000',
      strokeThickness: 3
    });
    txt.setOrigin(0.5);
    txt.setScale(scale);

    this.tweens.add({
      targets: txt,
      y: y - 28,
      alpha: 0,
      duration: 750,
      ease: 'Power1',
      onComplete: () => txt.destroy()
    });
  }

  createDustParticle(x, y) {
    const dust = this.add.sprite(x, y, 'particle_dust');
    dust.setScale(1.5);
    this.tweens.add({
      targets: dust,
      x: x - 20,
      y: y - 5,
      alpha: 0,
      duration: 300,
      onComplete: () => dust.destroy()
    });
  }

  // Cập nhật thanh máu cho toàn bộ quái vật trong wave
  updateAllHpBars() {
    for (const mob of this.waveMonsters) {
      if (!mob.hpBar || !mob.sprite) continue;

      if (mob.data.currentHp <= 0) {
        mob.hpBar.clear();
        continue;
      }

      mob.hpBar.clear();
      const isBoss = mob.data.isBoss;
      const barW = isBoss ? 75 : 44;
      const barH = isBoss ? 6 : 4;
      const barX = mob.sprite.x - barW / 2;
      const barY = mob.sprite.y - (isBoss ? 65 : 46);

      mob.hpBar.fillStyle(0x0f172a, 0.85);
      mob.hpBar.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

      const ratio = Math.max(0, mob.data.currentHp / mob.data.maxHp);
      mob.hpBar.fillStyle(isBoss ? 0xf97316 : (mob.data.isElite ? 0xfacc15 : 0xef4444), 1);
      mob.hpBar.fillRect(barX, barY, barW * ratio, barH);
    }
  }

  handleResize(newWidth, newHeight) {
    this.groundY = newHeight - 28;
    this.heroY = this.groundY - 6;
    if (this.hero) {
      this.hero.x = Math.min(120, newWidth * 0.22);
      this.hero.y = this.heroY;
    }
    this.drawSky(newWidth, newHeight);
    this.drawMountains(newWidth, newHeight);
    this.drawTrees(newWidth, newHeight);
    this.drawGroundPath(newWidth);
  }
}
