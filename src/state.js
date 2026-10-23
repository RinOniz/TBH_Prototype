// Game State & Idle Economy Manager - Quản lý 3 Class: Chiến Binh, Cung Thủ, Pháp Sư
// Tương đương với GameManager / ScriptableObject trong Unity
import {
  EQUIP_SLOTS,
  RARITY_DEFS,
  createItem,
  generateEmptyEquipped,
  generateMageStarterEquipped,
  generateWarriorStarterEquipped,
  generateArcherStarterEquipped,
  generateStarterInventory,
  generateLootDrop
} from './items.js';

export class GameState {
  constructor() {
    this.SAVE_KEY = 'taskbar_hero_web_save_v6';
    this.subscribers = [];

    // Danh sách định nghĩa 3 Class nhân vật
    this.classMeta = {
      warrior: {
        id: 'warrior',
        name: 'Chiến Binh',
        title: 'Hiệp Sĩ Thiết Giáp',
        avatar: '🗡️',
        color: '#38bdf8',
        role: 'Cận chiến • Máu trâu • Bền bỉ',
        spritePrefix: 'hero'
      },
      archer: {
        id: 'archer',
        name: 'Cung Thủ',
        title: 'Thiện Xạ Rừng Xanh',
        avatar: '🏹',
        color: '#22c55e',
        role: 'Tầm xa • Tốc bắn cao • Bạo kích',
        spritePrefix: 'archer'
      },
      mage: {
        id: 'mage',
        name: 'Pháp Sư',
        title: 'Đại Pháp Sư Cổ Đại (Sorcerer)',
        avatar: '🔮',
        color: '#a855f7',
        role: 'Phép thuật • Sát thương bùng nổ',
        spritePrefix: 'mage'
      }
    };

    // Định nghĩa nâng cấp riêng biệt cho từng Class
    this.classUpgradeDefs = {
      warrior: {
        weapon: { name: 'Kiếm Sắt Rèn', icon: '⚔️', desc: '+6 Sát thương', baseCost: 15, costMult: 1.15, calcValue: (l) => 12 + l * 6 },
        armor: { name: 'Giáp Bản Thép', icon: '🛡️', desc: '+40 Máu Tối Đa', baseCost: 20, costMult: 1.15, calcValue: (l) => 100 + l * 40 },
        boots: { name: 'Giày Chiến Binh', icon: '⚡', desc: '+0.1 Đòn/giây', baseCost: 35, costMult: 1.25, calcValue: (l) => +(1.0 + l * 0.1).toFixed(1) },
        accessory: { name: 'Nhẫn Dũng Sĩ', icon: '🎯', desc: '+2.5% Bạo kích', baseCost: 50, costMult: 1.22, calcValue: (l) => Math.min(75, +(5 + l * 2.5).toFixed(1)) },
        regen: { name: 'Trái Tim Sống', icon: '💖', desc: '+2 Hồi máu/s', baseCost: 30, costMult: 1.16, calcValue: (l) => 1 + l * 2 },
        gold: { name: 'Bùa Hút Vàng', icon: '💰', desc: '+15% Vàng rơi', baseCost: 25, costMult: 1.18, calcValue: (l) => +(1.0 + l * 0.15).toFixed(2) }
      },
      archer: {
        weapon: { name: 'Cung Gỗ Phong', icon: '🏹', desc: '+5 Sát thương', baseCost: 15, costMult: 1.15, calcValue: (l) => 10 + l * 5 },
        armor: { name: 'Áo Da Thợ Săn', icon: '🥋', desc: '+25 Máu Tối Đa', baseCost: 18, costMult: 1.14, calcValue: (l) => 75 + l * 25 },
        boots: { name: 'Giày Thần Gió', icon: '💨', desc: '+0.18 Đòn/giây', baseCost: 35, costMult: 1.24, calcValue: (l) => +(1.2 + l * 0.18).toFixed(1) },
        accessory: { name: 'Kính Ngắm Ưng', icon: '👁️', desc: '+3.5% Bạo kích', baseCost: 45, costMult: 1.22, calcValue: (l) => Math.min(85, +(8 + l * 3.5).toFixed(1)) },
        regen: { name: 'Thảo Dược Rừng', icon: '🌿', desc: '+1.5 Hồi máu/s', baseCost: 28, costMult: 1.16, calcValue: (l) => 1 + l * 1.5 },
        gold: { name: 'Túi Thợ Săn', icon: '🪙', desc: '+18% Vàng rơi', baseCost: 25, costMult: 1.18, calcValue: (l) => +(1.0 + l * 0.18).toFixed(2) }
      },
      mage: {
        weapon: { name: 'Gậy Tinh Thể', icon: '🪄', desc: '+9 Sát thương', baseCost: 20, costMult: 1.16, calcValue: (l) => 16 + l * 9 },
        armor: { name: 'Áo Choàng Phép', icon: '🔮', desc: '+20 Máu Tối Đa', baseCost: 16, costMult: 1.14, calcValue: (l) => 65 + l * 20 },
        boots: { name: 'Giày Huyền Thuật', icon: '✨', desc: '+0.09 Đòn/giây', baseCost: 40, costMult: 1.25, calcValue: (l) => +(0.9 + l * 0.09).toFixed(1) },
        accessory: { name: 'Ngọc Bí Thuật', icon: '💎', desc: '+2% Bạo kích', baseCost: 55, costMult: 1.22, calcValue: (l) => Math.min(75, +(6 + l * 2.0).toFixed(1)) },
        regen: { name: 'Suối Sinh Lực', icon: '💧', desc: '+2.5 Hồi máu/s', baseCost: 32, costMult: 1.16, calcValue: (l) => 1.5 + l * 2.5 },
        gold: { name: 'Bình Chiêu Tài', icon: '🏺', desc: '+20% Vàng rơi', baseCost: 28, costMult: 1.19, calcValue: (l) => +(1.0 + l * 0.2).toFixed(2) }
      }
    };

    // Định nghĩa Kỹ Năng riêng biệt cho từng Class
    this.classSkillDefs = {
      warrior: [
        { key: 'skill1', name: 'Cuồng Nộ', icon: '🔥', desc: '+120% Tốc đánh (6s)', duration: 6000, cd: 15000 },
        { key: 'skill2', name: 'Thiên Lôi', icon: '⚡', desc: 'Giáng sấm 350% DMG', duration: 0, cd: 18000 },
        { key: 'skill3', name: 'Bình Máu', icon: '🧪', desc: 'Hồi 50% HP', duration: 0, cd: 14000 }
      ],
      archer: [
        { key: 'skill1', name: 'Bắn Nhanh', icon: '💨', desc: '+160% Tốc bắn (5s)', duration: 5000, cd: 14000 },
        { key: 'skill2', name: 'Mưa Tên', icon: '🏹', desc: 'Bão tên 400% DMG', duration: 0, cd: 16000 },
        { key: 'skill3', name: 'Mắt Ưng', icon: '🎯', desc: '+40% Crit (7s)', duration: 7000, cd: 20000 }
      ],
      mage: [
        { key: 'skill1', name: 'Tụ Phép', icon: '✨', desc: '+120% DMG (6s)', duration: 6000, cd: 16000 },
        { key: 'skill2', name: 'Thiên Thạch', icon: '☄️', desc: 'Thiên thạch 450% DMG', duration: 0, cd: 20000 },
        { key: 'skill3', name: 'Khiên Băng', icon: '❄️', desc: 'Hồi 40% HP & Bất tử 3s', duration: 3000, cd: 18000 }
      ]
    };

    // Trạng thái dữ liệu game khởi đầu chuẩn (Level 1, 0 Vàng, Chưa mặc trang bị, Wave 1/10)
    this.data = {
      gold: 0,
      activeCharacter: 'warrior', // Bắt đầu với Chiến Binh
      stage: 1,
      subStage: 1,
      currentWave: 1,
      maxWaves: 10,
      maxUnlockedStage: 1,
      maxUnlockedSubStage: 1,
      totalKills: 0,
      totalBossKills: 0,
      isFarmingAfterBossLoss: false,
      autoChallengeBoss: false,
      autoAdvanceStage: true, // Tự động chuyển sang wave/ải tiếp theo khi thắng

      // Túi đồ dùng chung (Shared Inventory) với các trang bị cơ bản thử nghiệm
      inventory: generateStarterInventory(),

      // Quản lý riêng rẽ 3 nhân vật bắt đầu từ Cấp 1
      characters: {
        warrior: this.createInitialCharData('warrior'),
        archer: this.createInitialCharData('archer'),
        mage: this.createInitialCharData('mage')
      }
    };

    // Tên các World
    this.worldDefs = [
      { id: 1, name: 'Rừng Xanh Bí Ẩn', bossName: 'Vua Chất Nhờn (King Slime)', theme: 'forest' },
      { id: 2, name: 'Hang Động Hắc Ám', bossName: 'Chúa Tể Đầu Lâu (Skeleton Lord)', theme: 'cave' },
      { id: 3, name: 'Hầm Ngục Lửa Đỏ', bossName: 'Rồng Nham Thạch (Magma Drake)', theme: 'lava' },
      { id: 4, name: 'Vùng Đất Băng Giá', bossName: 'Khổng Lồ Băng (Frost Titan)', theme: 'ice' }
    ];

    this.load();
    this.updateMaxUnlocked();

    // Khởi tạo HP của nhân vật active
    this.currentEnemy = null;
    this.currentWaveMonsters = [];
  }

  createInitialCharData(charId) {
    const baseHp = charId === 'warrior' ? 120 : charId === 'archer' ? 95 : 80;

    return {
      level: 1,
      exp: 0,
      currentHp: baseHp,
      upgrades: { weapon: 0, armor: 0, boots: 0, accessory: 0, regen: 0, gold: 0 },
      skills: {
        skill1: { activeUntil: 0, cooldownUntil: 0 },
        skill2: { activeUntil: 0, cooldownUntil: 0 },
        skill3: { activeUntil: 0, cooldownUntil: 0 }
      },
      equipped: generateEmptyEquipped()
    };
  }

  // --- QUẢN LÝ CHUYỂN NHÂN VẬT ---
  get activeCharId() {
    return this.data.activeCharacter || 'warrior';
  }

  get activeChar() {
    return this.data.characters[this.activeCharId];
  }

  get activeCharMeta() {
    return this.classMeta[this.activeCharId];
  }

  switchCharacter(newCharId) {
    if (!this.data.characters[newCharId]) return false;
    this.data.activeCharacter = newCharId;
    this.save();
    this.notify();
    return true;
  }

  // --- TÍNH TOÁN CHỈ SỐ TRANG BỊ ĐANG MẶC (EQUIPMENT STATS) ---
  get equipStats() {
    return this.getCharEquipStats(this.activeCharId);
  }

  getCharEquipStats(charId) {
    const char = this.data.characters[charId];
    const total = { atk: 0, hp: 0, def: 0, crit: 0, speed: 0, regen: 0 };
    if (!char || !char.equipped) return total;

    for (const slotKey in char.equipped) {
      const item = char.equipped[slotKey];
      if (item && item.stats) {
        if (item.stats.atk) total.atk += item.stats.atk;
        if (item.stats.hp) total.hp += item.stats.hp;
        if (item.stats.def) total.def += item.stats.def;
        if (item.stats.crit) total.crit += item.stats.crit;
        if (item.stats.speed) total.speed += item.stats.speed;
        if (item.stats.regen) total.regen += item.stats.regen;
      }
    }
    return total;
  }

  // --- GETTERS DÀNH CHO NHÂN VẬT ĐANG HOẠT ĐỘNG (ACTIVE CHARACTER) ---
  get maxHp() {
    const char = this.activeChar;
    const def = this.classUpgradeDefs[this.activeCharId].armor;
    const base = def.calcValue(char.upgrades.armor);
    return base + this.equipStats.hp;
  }

  get currentHp() {
    if (this.activeChar.currentHp === undefined || this.activeChar.currentHp <= 0) {
      this.activeChar.currentHp = this.maxHp;
    }
    return Math.min(this.maxHp, this.activeChar.currentHp);
  }

  set currentHp(val) {
    this.activeChar.currentHp = Math.max(0, Math.min(this.maxHp, val));
  }

  get baseDamage() {
    const char = this.activeChar;
    const def = this.classUpgradeDefs[this.activeCharId].weapon;
    return def.calcValue(char.upgrades.weapon);
  }

  get levelBonusDamage() {
    return (this.activeChar.level - 1) * 2;
  }

  get damage() {
    let dmg = this.baseDamage + this.levelBonusDamage + this.equipStats.atk;
    // Buff tụ phép của Mage
    if (this.activeCharId === 'mage' && Date.now() < this.activeChar.skills.skill1.activeUntil) {
      dmg = Math.round(dmg * 2.2);
    }
    return dmg;
  }

  get isFrenzyActive() {
    const s1 = this.activeChar.skills.skill1;
    return Date.now() < s1.activeUntil;
  }

  get attackSpeed() {
    const char = this.activeChar;
    const def = this.classUpgradeDefs[this.activeCharId].boots;
    let spd = def.calcValue(char.upgrades.boots) + this.equipStats.speed;

    // Warrior Frenzy (+120%) hoặc Archer Rapid Fire (+160%)
    if (this.isFrenzyActive) {
      const mult = this.activeCharId === 'archer' ? 2.6 : 2.2;
      spd = +(spd * mult).toFixed(2);
    }
    return +spd.toFixed(2);
  }

  get critChance() {
    const char = this.activeChar;
    const def = this.classUpgradeDefs[this.activeCharId].accessory;
    let crit = def.calcValue(char.upgrades.accessory) + this.equipStats.crit;

    // Buff Mắt Ưng của Archer (+40%)
    if (this.activeCharId === 'archer' && Date.now() < char.skills.skill3.activeUntil) {
      crit = Math.min(100, crit + 40);
    }
    return Math.min(100, crit);
  }

  get critDamageMult() {
    // Mage có sát thương bạo kích cao hơn
    return this.activeCharId === 'mage' ? 2.3 : 2.0;
  }

  get hpRegen() {
    const char = this.activeChar;
    const def = this.classUpgradeDefs[this.activeCharId].regen;
    return def.calcValue(char.upgrades.regen) + this.equipStats.regen;
  }

  get goldMultiplier() {
    const char = this.activeChar;
    const def = this.classUpgradeDefs[this.activeCharId].gold;
    return def.calcValue(char.upgrades.gold);
  }

  get maxExp() {
    return Math.floor(25 * Math.pow(1.35, this.activeChar.level - 1));
  }

  get clickDamage() {
    return Math.max(5, Math.floor(this.damage * 0.75));
  }

  get heroTitle() {
    const lvl = this.activeChar.level;
    const meta = this.activeCharMeta;
    if (lvl >= 20) return `👑 Tối Thượng ${meta.name}`;
    if (lvl >= 10) return `⚔️ Bậc Thầy ${meta.name}`;
    if (lvl >= 5) return `🛡️ Thợ Săn ${meta.name}`;
    return `🌱 ${meta.name} Tập Sự`;
  }

  // Lấy danh sách nâng cấp của nhân vật active
  get currentUpgradeDefs() {
    return this.classUpgradeDefs[this.activeCharId];
  }

  // Lấy danh sách kỹ năng của nhân vật active
  get currentSkillDefs() {
    return this.classSkillDefs[this.activeCharId];
  }

  // --- TIỀN & KINH NGHIỆM ---
  addGold(amount) {
    const finalAmount = Math.max(1, Math.round(amount * this.goldMultiplier));
    this.data.gold += finalAmount;
    this.notify();
    return finalAmount;
  }

  addExp(amount) {
    const char = this.activeChar;
    char.exp += amount;
    let leveledUp = false;
    while (char.exp >= this.maxExp) {
      char.exp -= this.maxExp;
      char.level += 1;
      this.currentHp = this.maxHp;
      leveledUp = true;
    }
    this.notify();
    return leveledUp;
  }

  // --- NÂNG CẤP TRANG BỊ CHO CLASS ACTIVE ---
  getUpgradeCost(key) {
    const def = this.currentUpgradeDefs[key];
    const lvl = this.activeChar.upgrades[key];
    return Math.floor(def.baseCost * Math.pow(def.costMult, lvl));
  }

  canAfford(key) {
    return this.data.gold >= this.getUpgradeCost(key);
  }

  buyUpgrade(key) {
    const cost = this.getUpgradeCost(key);
    if (this.data.gold >= cost) {
      this.data.gold -= cost;
      this.activeChar.upgrades[key] += 1;

      if (key === 'armor') {
        this.currentHp = Math.min(this.maxHp, this.currentHp + 30);
      }

      this.save();
      this.notify();
      return true;
    }
    return false;
  }

  // --- KỸ NĂNG CHỦ ĐỘNG ---
  getSkillDef(skillKey) {
    return this.currentSkillDefs.find(s => s.key === skillKey);
  }

  canUseSkill(skillKey) {
    const charSkill = this.activeChar.skills[skillKey];
    return Date.now() >= charSkill.cooldownUntil;
  }

  getSkillCooldownProgress(skillKey) {
    const charSkill = this.activeChar.skills[skillKey];
    const def = this.getSkillDef(skillKey);
    const now = Date.now();
    if (now >= charSkill.cooldownUntil) return 0;
    const remaining = charSkill.cooldownUntil - now;
    return remaining / def.cd;
  }

  useSkill(skillKey) {
    if (!this.canUseSkill(skillKey)) return false;
    const now = Date.now();
    const charSkill = this.activeChar.skills[skillKey];
    const def = this.getSkillDef(skillKey);

    charSkill.cooldownUntil = now + def.cd;

    if (def.duration > 0) {
      charSkill.activeUntil = now + def.duration;
    }

    // Hiệu ứng hồi máu (Warrior Potion hoặc Mage Frost Shield)
    if (this.activeCharId === 'warrior' && skillKey === 'skill3') {
      const heal = Math.floor(this.maxHp * 0.5);
      this.currentHp = Math.min(this.maxHp, this.currentHp + heal);
    } else if (this.activeCharId === 'mage' && skillKey === 'skill3') {
      const heal = Math.floor(this.maxHp * 0.4);
      this.currentHp = Math.min(this.maxHp, this.currentHp + heal);
    }

    this.notify();
    return true;
  }

  // --- MAP & TIẾN TRÌNH THẾ GIỚI ---
  getCurrentWorld() {
    return this.getWorld(this.data.stage);
  }

  getWorld(worldId) {
    const idx = (worldId - 1) % this.worldDefs.length;
    const def = this.worldDefs[idx];
    return {
      ...def,
      id: worldId,
      name: worldId > this.worldDefs.length ? `${def.name} (Tầng ${Math.ceil(worldId / this.worldDefs.length)})` : def.name
    };
  }

  updateMaxUnlocked() {
    if (!this.data.maxUnlockedStage) this.data.maxUnlockedStage = this.data.stage;
    if (!this.data.maxUnlockedSubStage) this.data.maxUnlockedSubStage = this.data.subStage;

    if (this.data.stage > this.data.maxUnlockedStage) {
      this.data.maxUnlockedStage = this.data.stage;
      this.data.maxUnlockedSubStage = this.data.subStage;
    } else if (this.data.stage === this.data.maxUnlockedStage) {
      if (this.data.subStage > this.data.maxUnlockedSubStage) {
        this.data.maxUnlockedSubStage = this.data.subStage;
      }
    }
  }

  isStageUnlocked(targetStage, targetSubStage) {
    if (targetStage < this.data.maxUnlockedStage) return true;
    if (targetStage === this.data.maxUnlockedStage) {
      return targetSubStage <= this.data.maxUnlockedSubStage;
    }
    return false;
  }

  setStage(targetStage, targetSubStage) {
    if (!this.isStageUnlocked(targetStage, targetSubStage)) return false;
    this.data.stage = targetStage;
    this.data.subStage = targetSubStage;
    this.data.currentWave = 1;
    this.data.isFarmingAfterBossLoss = false;
    this.save();
    this.notify();
    return true;
  }

  challengeBoss() {
    this.data.currentWave = 10;
    this.data.isFarmingAfterBossLoss = false;
    this.save();
    this.notify();
    return true;
  }

  toggleAutoChallengeBoss() {
    this.data.autoChallengeBoss = !this.data.autoChallengeBoss;
    this.save();
    this.notify();
    return this.data.autoChallengeBoss;
  }

  toggleAutoAdvance() {
    this.data.autoAdvanceStage = !this.data.autoAdvanceStage;
    this.save();
    this.notify();
    return this.data.autoAdvanceStage;
  }

  handleHeroDefeat() {
    let result = {
      action: 'RETRY_SAME_WAVE',
      stage: this.data.stage,
      subStage: this.data.subStage,
      wave: this.data.currentWave || 1,
      message: 'Hồi sinh và thử lại Wave hiện tại...'
    };

    if (this.data.currentWave === 10) {
      // Thất bại trước Boss của Ải -> Lùi về Wave 9 để treo máy farm
      this.data.currentWave = 9;
      this.data.isFarmingAfterBossLoss = true;
      result = {
        action: 'RETREAT_TO_WAVE_9',
        stage: this.data.stage,
        subStage: this.data.subStage,
        wave: 9,
        message: 'Thất bại trước Boss! Đang lùi về Wave 9 để treo máy rèn luyện...'
      };
    }

    this.currentHp = this.maxHp;
    this.save();
    this.notify();
    return result;
  }

  // --- SINH WAVE QUÁI VẬT & ĐỘ KHÓ TĂNG DẦN (WAVE 1 ➔ WAVE 10) ---
  spawnMonsterWave() {
    const stage = this.data.stage;
    const subStage = this.data.subStage;
    const wave = Math.max(1, Math.min(10, this.data.currentWave || 1));
    const isBossWave = (wave === 10);

    // Hệ số tiến trình chung theo Thế Giới và Ải
    const globalProgress = (stage - 1) * 10 + (subStage - 1);
    const stageMult = Math.pow(1.14, globalProgress);

    if (isBossWave) {
      // Wave 10: BOSS CỦA ẢI ĐÓ!
      let bossName = `Trùm Ải ${stage}-${subStage}`;
      let bossType = 'boss_slime';

      if (subStage === 10) {
        // TRÙM CUỐI CỦA THẾ GIỚI (World Boss)
        const worldInfo = this.getWorld(stage);
        bossName = worldInfo.bossName || `Vua Trùm Thế Giới ${stage}`;
        bossType = stage === 2 ? 'boss_skeleton' : stage >= 3 ? 'boss_dragon' : 'boss_slime';
      } else {
        const subBossList = [
          { name: 'Slime Chúa Độc', type: 'slime' },
          { name: 'Dơi Quỷ Huyết Dạ', type: 'bat' },
          { name: 'Xương Cổ Đại Đao', type: 'skeleton' },
          { name: 'Goblin Đao Phủ', type: 'goblin' },
          { name: 'Vua Nhầy Tinh Thạch', type: 'slime' },
          { name: 'Bóng Ma Hắc Dơi', type: 'bat' },
          { name: 'Kỵ Sĩ Xương Cốt', type: 'skeleton' },
          { name: 'Thủ Lĩnh Yêu Tinh', type: 'goblin' },
          { name: 'Hắc Ma Quái Chúa', type: 'boss_slime' }
        ];
        const sb = subBossList[(subStage - 1) % subBossList.length];
        bossName = `${sb.name} (Boss Ải ${stage}-${subStage})`;
        bossType = sb.type;
      }

      const bossHp = Math.round((75 + subStage * 18) * stageMult * (subStage === 10 ? 2.8 : 1.8));
      const bossDmg = Math.max(2, Math.round((2.5 + subStage * 0.7) * stageMult * (subStage === 10 ? 1.8 : 1.3)));
      const bossGold = Math.max(15, Math.round((20 + subStage * 12) * stageMult * 2.5));
      const bossExp = Math.max(25, Math.round((30 + subStage * 15) * stageMult * 2.5));

      const bossMob = {
        id: `boss_${Date.now()}_0`,
        name: bossName,
        type: bossType,
        isBoss: true,
        isWorldBoss: subStage === 10,
        maxHp: bossHp,
        currentHp: bossHp,
        damage: bossDmg,
        gold: bossGold,
        exp: bossExp,
        attackSpeedMs: 1100
      };

      const waveMonsters = [bossMob];
      // Nếu từ Ải 3 trở lên, Boss có thêm 1 hộ vệ nhỏ
      if (subStage >= 3) {
        const minionHp = Math.round(bossHp * 0.25);
        waveMonsters.push({
          id: `minion_${Date.now()}_1`,
          name: `Hộ Vệ ${bossName}`,
          type: (subStage % 2 === 0) ? 'goblin' : 'slime',
          isBoss: false,
          maxHp: minionHp,
          currentHp: minionHp,
          damage: Math.max(1, Math.round(bossDmg * 0.4)),
          gold: Math.round(bossGold * 0.2),
          exp: Math.round(bossExp * 0.2),
          attackSpeedMs: 1300
        });
      }

      this.currentWaveMonsters = waveMonsters;
      this.currentEnemy = bossMob;
      return waveMonsters;
    }

    // Wave 1 đến 9: Số lượng quái tăng dần theo wave (2 đến 6 con)!
    // Wave 1: 2 con | Wave 3: 3 con | Wave 5: 4 con (Elite) | Wave 7: 5 con | Wave 9: 6 con
    const monsterCount = Math.min(6, 2 + Math.floor((wave - 1) / 1.7));
    const waveMult = Math.pow(1.10, wave - 1);

    const normalTypes = ['slime', 'bat', 'skeleton', 'goblin'];
    const waveMonsters = [];

    for (let i = 0; i < monsterCount; i++) {
      const typeIdx = (subStage + wave + i) % normalTypes.length;
      const type = normalTypes[typeIdx];
      const isElite = (wave === 5 && i === 0);

      const baseHp = Math.round((12 + subStage * 4) * stageMult * waveMult * (isElite ? 1.7 : 1.0));
      const baseDmg = Math.max(1, Math.round((1.0 + subStage * 0.35) * stageMult * (wave >= 6 ? 1.25 : 1.0) * (isElite ? 1.4 : 1.0)));
      const baseGold = Math.max(1, Math.round((2.0 + subStage * 1.2) * stageMult * (1 + wave * 0.12)));
      const baseExp = Math.max(3, Math.round((3.0 + subStage * 1.5) * stageMult * (1 + wave * 0.12)));

      const names = {
        slime: isElite ? 'Slime Đột Biến' : 'Slime Rừng Xanh',
        bat: isElite ? 'Dơi Quỷ Hắc Ám' : 'Dơi Bóng Tối',
        skeleton: isElite ? 'Đội Trưởng Bộ Xương' : 'Chiến Binh Xương',
        goblin: isElite ? 'Goblin Tinh Anh' : 'Goblin Tinh Nghịch'
      };

      waveMonsters.push({
        id: `mob_${wave}_${i}_${Date.now()}`,
        name: `${names[type]} (Wave ${wave})`,
        type,
        isBoss: false,
        isElite,
        maxHp: baseHp,
        currentHp: baseHp,
        damage: baseDmg,
        gold: baseGold,
        exp: baseExp,
        attackSpeedMs: 1200 + Math.floor(Math.random() * 300)
      });
    }

    this.currentWaveMonsters = waveMonsters;
    this.currentEnemy = waveMonsters[0];
    return waveMonsters;
  }

  spawnMonster() {
    const wave = this.spawnMonsterWave();
    return wave[0];
  }

  advanceWave(monstersKilledCount = 1) {
    this.data.totalKills += monstersKilledCount;

    // 1. Nếu đang treo máy sau khi thua Boss (ở Wave 9)
    if (this.data.isFarmingAfterBossLoss) {
      if (this.data.autoChallengeBoss) {
        this.data.currentWave = 10;
        this.data.isFarmingAfterBossLoss = false;
        this.save();
        this.notify();
        return { type: 'CHALLENGE_BOSS', stage: this.data.stage, subStage: this.data.subStage, wave: 10 };
      } else {
        this.data.currentWave = 9;
        this.save();
        this.notify();
        return { type: 'FARMING_WAVE_9', stage: this.data.stage, subStage: this.data.subStage, wave: 9 };
      }
    }

    // 2. Nếu vừa hạ gục Wave 10 (Boss của Ải)!
    if (this.data.currentWave === 10) {
      this.data.totalBossKills += 1;
      this.data.currentWave = 1;
      this.data.isFarmingAfterBossLoss = false;

      // Hạ gục Boss cuối ở Ải 10 -> Lên Thế Giới mới!
      if (this.data.subStage === 10) {
        this.data.stage += 1;
        this.data.subStage = 1;
        this.updateMaxUnlocked();
        this.save();
        this.notify();
        return { type: 'NEXT_WORLD', stage: this.data.stage, subStage: 1, wave: 1 };
      }

      // Hạ gục Boss của Ải thường (1-1 -> 1-2, 1-2 -> 1-3...)
      this.data.subStage += 1;
      this.updateMaxUnlocked();
      this.save();
      this.notify();
      return { type: 'NEXT_SUBSTAGE', stage: this.data.stage, subStage: this.data.subStage, wave: 1 };
    }

    // 3. Nếu tắt chế độ tự động qua ải: Giữ nguyên wave hiện tại để treo máy
    if (this.data.autoAdvanceStage === false) {
      this.save();
      this.notify();
      return { type: 'REPEAT_WAVE', stage: this.data.stage, subStage: this.data.subStage, wave: this.data.currentWave };
    }

    // 4. Bình thường: Tiến lên Wave tiếp theo (1 -> 2 -> ... -> 10)
    this.data.currentWave += 1;
    this.save();
    this.notify();
    return { type: 'NEXT_WAVE', stage: this.data.stage, subStage: this.data.subStage, wave: this.data.currentWave };
  }

  advanceStage() {
    return this.advanceWave(1);
  }

  // --- QUẢN LÝ TRANG BỊ & TÚI ĐỒ (EQUIPMENT & INVENTORY) ---
  equipItem(charId, invIndex, targetSlot = null) {
    const char = this.data.characters[charId];
    if (!char || !this.data.inventory[invIndex]) return false;

    const item = this.data.inventory[invIndex];

    // Kiểm tra class yêu cầu
    if (item.classReq !== 'all' && item.classReq !== charId) {
      return { success: false, reason: `Trang bị chỉ dành cho ${this.classMeta[item.classReq]?.name || item.classReq}` };
    }

    // Xác định ô trang bị phù hợp
    let slot = targetSlot;
    if (!slot) {
      if (item.slot === 'ring') {
        slot = (!char.equipped.ring1) ? 'ring1' : (!char.equipped.ring2) ? 'ring2' : 'ring1';
      } else if (item.slot === 'bracelet') {
        slot = (!char.equipped.bracelet1) ? 'bracelet1' : (!char.equipped.bracelet2) ? 'bracelet2' : 'bracelet1';
      } else {
        slot = item.slot;
      }
    }

    if (!EQUIP_SLOTS[slot]) {
      return { success: false, reason: 'Vị trí trang bị không hợp lệ' };
    }

    // Hoán đổi trang bị cũ (nếu có) vào túi đồ
    const oldItem = char.equipped[slot];
    char.equipped[slot] = item;

    if (oldItem) {
      this.data.inventory[invIndex] = oldItem;
    } else {
      this.data.inventory.splice(invIndex, 1);
    }

    this.save();
    this.notify();
    return { success: true, slot, item };
  }

  unequipItem(charId, slotKey) {
    const char = this.data.characters[charId];
    if (!char || !char.equipped || !char.equipped[slotKey]) return false;

    if (this.data.inventory.length >= 28) {
      return { success: false, reason: 'Túi đồ đã đầy (tối đa 28 ô)!' };
    }

    const item = char.equipped[slotKey];
    char.equipped[slotKey] = null;
    this.data.inventory.push(item);

    this.save();
    this.notify();
    return { success: true, item };
  }

  sellItem(invIndex) {
    if (invIndex < 0 || invIndex >= this.data.inventory.length) return false;
    const item = this.data.inventory[invIndex];
    const goldEarned = item.value || Math.round(item.level * 25);
    this.data.gold += goldEarned;
    this.data.inventory.splice(invIndex, 1);
    this.save();
    this.notify();
    return { success: true, gold: goldEarned, item };
  }

  enhanceItem(charId, slotKey) {
    const char = this.data.characters[charId];
    if (!char || !char.equipped || !char.equipped[slotKey]) return false;
    const item = char.equipped[slotKey];
    const cost = Math.round(item.level * 50);

    if (this.data.gold < cost) {
      return { success: false, reason: `Không đủ vàng (cần ${cost.toLocaleString()} Vàng)!` };
    }

    this.data.gold -= cost;
    item.level += 1;
    for (const stat in item.stats) {
      if (item.stats[stat] > 0) {
        if (stat === 'speed') item.stats[stat] = +(item.stats[stat] + 0.01).toFixed(2);
        else item.stats[stat] = Math.round(item.stats[stat] * 1.05 + 1);
      }
    }
    this.save();
    this.notify();
    return { success: true, item, cost };
  }

  autoEquip(charId) {
    const char = this.data.characters[charId];
    if (!char) return false;

    let equippedCount = 0;
    for (const slotKey in EQUIP_SLOTS) {
      let bestIdx = -1;
      let bestScore = -1;

      const currentItem = char.equipped[slotKey];
      if (currentItem) {
        bestScore = (currentItem.stats.atk || 0) * 2 + (currentItem.stats.hp || 0) + (currentItem.stats.def || 0) * 1.5;
      }

      for (let i = 0; i < this.data.inventory.length; i++) {
        const item = this.data.inventory[i];
        if (item.classReq !== 'all' && item.classReq !== charId) continue;

        let match = false;
        if (slotKey === item.slot) match = true;
        else if (item.slot === 'ring' && (slotKey === 'ring1' || slotKey === 'ring2')) match = true;
        else if (item.slot === 'bracelet' && (slotKey === 'bracelet1' || slotKey === 'bracelet2')) match = true;

        if (match) {
          const score = (item.stats.atk || 0) * 2 + (item.stats.hp || 0) + (item.stats.def || 0) * 1.5;
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }
      }

      if (bestIdx !== -1) {
        this.equipItem(charId, bestIdx, slotKey);
        equippedCount += 1;
      }
    }

    return equippedCount;
  }

  dropLootMonster(isBoss, stage, subStage) {
    const dropped = generateLootDrop(stage, subStage, isBoss);
    if (!dropped) return null;

    if (this.data.inventory.length < 28) {
      this.data.inventory.push(dropped);
      this.save();
      this.notify();
      return dropped;
    }
    return null;
  }

  // --- SAVE / LOAD ---
  save() {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Không thể lưu save:', e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.data,
          ...parsed,
          gold: typeof parsed.gold === 'number' ? parsed.gold : 0,
          currentWave: typeof parsed.currentWave === 'number' ? parsed.currentWave : 1,
          autoAdvanceStage: parsed.autoAdvanceStage !== undefined ? parsed.autoAdvanceStage : true,
          inventory: (parsed.inventory && parsed.inventory.length > 0) ? parsed.inventory : generateStarterInventory(),
          characters: {
            warrior: {
              ...this.createInitialCharData('warrior'),
              ...(parsed.characters?.warrior || {}),
              equipped: parsed.characters?.warrior?.equipped || generateEmptyEquipped()
            },
            archer: {
              ...this.createInitialCharData('archer'),
              ...(parsed.characters?.archer || {}),
              equipped: parsed.characters?.archer?.equipped || generateEmptyEquipped()
            },
            mage: {
              ...this.createInitialCharData('mage'),
              ...(parsed.characters?.mage || {}),
              equipped: parsed.characters?.mage?.equipped || generateEmptyEquipped()
            }
          }
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc save game:', e);
    }
  }

  reset() {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      localStorage.removeItem('taskbar_hero_web_save_v1');
      localStorage.removeItem('taskbar_hero_web_save_v2');
      localStorage.removeItem('taskbar_hero_web_save_v3');
      localStorage.removeItem('taskbar_hero_web_save_v4');
      localStorage.removeItem('taskbar_hero_web_save_v5');
    } catch (e) {}
    window.location.reload();
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  notify() {
    for (const fn of this.subscribers) {
      fn(this);
    }
  }
}

export const gameState = new GameState();
