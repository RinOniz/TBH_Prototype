// Hệ Thống Trang Bị & Túi Đồ (Equipment & Inventory System)
// Chuẩn phong cách TaskBarHero: 12 Ô Trang Bị (6 Giáp + 6 Phụ Kiện), 28 Ô Túi Đồ, Phân loại Rarity

export const EQUIP_SLOTS = {
  // 6 Trang bị chính bên trái (Gear)
  main_weapon: { key: 'main_weapon', name: 'Vũ Khí Chính', type: 'gear', icon: '⚔️', placeholder: '🗡️' },
  sub_weapon: { key: 'sub_weapon', name: 'Vũ Khí Phụ', type: 'gear', icon: '🛡️', placeholder: '🛡️' },
  helmet: { key: 'helmet', name: 'Mũ Giáp', type: 'gear', icon: '🪖', placeholder: '🪖' },
  armor: { key: 'armor', name: 'Áo Giáp', type: 'gear', icon: '🥋', placeholder: '🥋' },
  pants: { key: 'pants', name: 'Quần Giáp', type: 'gear', icon: '👖', placeholder: '👖' },
  boots: { key: 'boots', name: 'Giày', type: 'gear', icon: '👢', placeholder: '👢' },

  // 6 Phụ kiện bên phải (Accessories)
  necklace: { key: 'necklace', name: 'Dây Chuyền', type: 'accessory', icon: '📿', placeholder: '📿' },
  earring: { key: 'earring', name: 'Khuyên Tai', type: 'accessory', icon: '💎', placeholder: '💎' },
  ring1: { key: 'ring1', name: 'Nhẫn 1', type: 'accessory', icon: '💍', placeholder: '💍' },
  ring2: { key: 'ring2', name: 'Nhẫn 2', type: 'accessory', icon: '💍', placeholder: '💍' },
  bracelet1: { key: 'bracelet1', name: 'Vòng Tay 1', type: 'accessory', icon: '🧿', placeholder: '🧿' },
  bracelet2: { key: 'bracelet2', name: 'Vòng Tay 2', type: 'accessory', icon: '🧿', placeholder: '🧿' }
};

export const RARITY_DEFS = {
  common: { id: 'common', name: 'Thường', color: '#94a3b8', bg: 'rgba(51, 65, 85, 0.45)', border: '#64748b', mult: 1.0 },
  uncommon: { id: 'uncommon', name: 'Tốt', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.25)', border: '#22c55e', mult: 1.3 },
  rare: { id: 'rare', name: 'Hiếm', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.28)', border: '#3b82f6', mult: 1.7 },
  epic: { id: 'epic', name: 'Sử Thi', color: '#c084fc', bg: 'rgba(168, 85, 247, 0.32)', border: '#a855f7', mult: 2.3 },
  legendary: { id: 'legendary', name: 'Huyền Thoại', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.35)', border: '#f59e0b', mult: 3.2 }
};

let itemIdCounter = 1000;

export function createItem(name, slot, rarity, level, classReq = 'all', icon = '⚔️', customStats = {}, desc = '') {
  itemIdCounter += 1;
  const rDef = RARITY_DEFS[rarity] || RARITY_DEFS.common;
  const mult = rDef.mult;

  // Tính toán stats cơ bản theo slot & level
  const stats = { atk: 0, hp: 0, def: 0, crit: 0, speed: 0, regen: 0 };

  if (slot === 'main_weapon') {
    stats.atk = Math.round((level * 2.8 + 12) * mult);
    if (level >= 50) stats.crit = Math.round(3 * mult);
  } else if (slot === 'sub_weapon') {
    stats.atk = Math.round((level * 1.2 + 6) * mult);
    stats.def = Math.round((level * 1.5 + 8) * mult);
  } else if (slot === 'helmet') {
    stats.hp = Math.round((level * 6 + 30) * mult);
    stats.def = Math.round((level * 1.8 + 8) * mult);
  } else if (slot === 'armor') {
    stats.hp = Math.round((level * 10 + 50) * mult);
    stats.def = Math.round((level * 2.5 + 12) * mult);
  } else if (slot === 'pants') {
    stats.hp = Math.round((level * 7 + 35) * mult);
    stats.def = Math.round((level * 2.0 + 10) * mult);
  } else if (slot === 'boots') {
    stats.hp = Math.round((level * 5 + 25) * mult);
    stats.speed = +(0.05 * mult).toFixed(2);
  } else if (slot === 'necklace') {
    stats.hp = Math.round((level * 8 + 40) * mult);
    stats.atk = Math.round((level * 1.4 + 6) * mult);
  } else if (slot === 'earring') {
    stats.atk = Math.round((level * 1.2 + 5) * mult);
    stats.crit = Math.min(25, Math.round(2.5 * mult));
  } else if (slot === 'ring' || slot === 'ring1' || slot === 'ring2') {
    stats.atk = Math.round((level * 1.8 + 8) * mult);
    stats.crit = Math.min(30, Math.round(3.0 * mult));
  } else if (slot === 'bracelet' || slot === 'bracelet1' || slot === 'bracelet2') {
    stats.hp = Math.round((level * 6 + 30) * mult);
    stats.regen = Math.round((level * 0.3 + 1) * mult);
  }

  // Ghi đè stats tuỳ chỉnh nếu có
  Object.assign(stats, customStats);

  return {
    id: `item_${Date.now()}_${itemIdCounter}_${Math.floor(Math.random() * 1000)}`,
    name,
    slot,
    rarity,
    level,
    classReq,
    icon,
    stats,
    desc: desc || `Trang bị cấp ${level} phẩm chất ${rDef.name}. Tăng sức mạnh chiến đấu.`,
    value: Math.round(level * 20 * mult)
  };
}

// Khởi tạo trang bị mặc định cho Pháp Sư (Sorcerer / Mage) giống hệt ảnh TaskBarHero
export function generateMageStarterEquipped() {
  return {
    main_weapon: createItem('Trượng Tinh Vân Cổ', 'main_weapon', 'epic', 90, 'mage', '🪄', { atk: 245, crit: 7 }, 'Quyền trượng cổ đại toả ánh tím huyền bí.'),
    sub_weapon: createItem('Quả Cầu Hắc Thuật', 'sub_weapon', 'uncommon', 15, 'mage', '🔮', { atk: 35, def: 20 }, 'Pháp bảo ngưng tụ nguyên tố bóng tối.'),
    helmet: createItem('Nón Đại Pháp Sư', 'helmet', 'epic', 90, 'mage', '🧙', { hp: 580, def: 120 }, 'Chiếc nón phù thuỷ huyền thoại che khuất ánh nhìn.'),
    armor: createItem('Áo Choàng Ngân Hà', 'armor', 'epic', 80, 'mage', '👘', { hp: 780, def: 160 }, 'Dệt từ tơ của nhện không gian, cản phép thuật cực tốt.'),
    pants: createItem('Quần Vải Huyền Thuật', 'pants', 'uncommon', 15, 'mage', '👖', { hp: 140, def: 35 }, 'Quần vải nhẹ nhàng giúp di chuyển linh hoạt.'),
    boots: createItem('Giày Huyền Thuật', 'boots', 'uncommon', 15, 'mage', '👢', { hp: 120, speed: 0.1 }, 'Tăng nhẹ tốc độ thi triển ma pháp.'),
    necklace: createItem('Chuỗi Ngọc Ma Thuật', 'necklace', 'epic', 80, 'mage', '📿', { hp: 650, atk: 95 }, 'Dây chuyền chứa viên bảo ngọc rực rỡ.'),
    earring: createItem('Khuyên Tai Huyết Quang', 'earring', 'epic', 80, 'mage', '💎', { atk: 85, crit: 10 }, 'Phát ra ánh đỏ khi chủ nhân niệm chú.'),
    ring1: createItem('Nhẫn Hắc Diện Thạch', 'ring1', 'uncommon', 15, 'mage', '💍', { atk: 32, crit: 4 }, 'Nhẫn đá đen rèn thời kỳ đầu.'),
    ring2: createItem('Nhẫn Quỷ Satan', 'ring2', 'epic', 90, 'mage', '💍', { atk: 185, crit: 12 }, 'Chứa linh hồn ác quỷ tăng mạnh sát thương bạo kích.'),
    bracelet1: createItem('Vòng Tay Hoàng Gia', 'bracelet1', 'epic', 90, 'mage', '🧿', { hp: 620, regen: 18 }, 'Vòng ngọc khảm vàng tăng cường khả năng hồi máu.'),
    bracelet2: null
  };
}

// Khởi tạo trang bị mặc định cho Chiến Binh (Warrior)
export function generateWarriorStarterEquipped() {
  return {
    main_weapon: createItem('Đại Kiếm Bản Thép', 'main_weapon', 'rare', 50, 'warrior', '⚔️', { atk: 135, crit: 5 }, 'Thanh kiếm dày dặn chém đứt sắt thép.'),
    sub_weapon: createItem('Khiên Thiết Giáp', 'sub_weapon', 'rare', 45, 'warrior', '🛡️', { def: 65, hp: 180 }, 'Tấm khiên thép vững chãi như núi.'),
    helmet: createItem('Mũ Thiết Giáp', 'helmet', 'uncommon', 30, 'warrior', '🪖', { hp: 190, def: 45 }, 'Bảo vệ đầu hiệp sĩ khỏi đòn hiểm.'),
    armor: createItem('Giáp Thép Hộ Vệ', 'armor', 'rare', 50, 'warrior', '🥋', { hp: 420, def: 95 }, 'Áo giáp bản kim loại chống đỡ va đập.'),
    pants: createItem('Quần Bản Thép', 'pants', 'uncommon', 30, 'warrior', '👖', { hp: 180, def: 40 }, 'Quần giáp bảo vệ chân.'),
    boots: createItem('Ủng Titan', 'boots', 'rare', 40, 'warrior', '👢', { hp: 160, speed: 0.12 }, 'Ủng nặng tạo lực dậm mạnh.'),
    necklace: createItem('Dây Chuyền Dũng Khí', 'necklace', 'uncommon', 25, 'warrior', '📿', { hp: 150, atk: 25 }, 'Biểu tượng của lòng can đảm.'),
    earring: null,
    ring1: createItem('Nhẫn Lực Sĩ', 'ring1', 'rare', 40, 'warrior', '💍', { atk: 55, crit: 6 }, 'Tăng sức mạnh cho từng nhát chém.'),
    ring2: null,
    bracelet1: createItem('Vòng Tay Thép Rèn', 'bracelet1', 'uncommon', 25, 'warrior', '🧿', { hp: 120, regen: 5 }, 'Hỗ trợ lưu thông khí huyết.'),
    bracelet2: null
  };
}

// Khởi tạo trang bị mặc định cho Cung Thủ (Archer)
export function generateArcherStarterEquipped() {
  return {
    main_weapon: createItem('Cung Phong Thần', 'main_weapon', 'rare', 55, 'archer', '🏹', { atk: 145, crit: 10 }, 'Mỗi phát bắn xé toạc màn gió.'),
    sub_weapon: createItem('Ống Tên Thần Tốc', 'sub_weapon', 'uncommon', 35, 'archer', '🎯', { atk: 35, speed: 0.15 }, 'Chứa những mũi tên lông ưng.'),
    helmet: createItem('Mũ Trùm Thợ Săn', 'helmet', 'uncommon', 30, 'archer', '👒', { hp: 160, crit: 4 }, 'Nguỵ trang hoàn hảo trong bóng cây.'),
    armor: createItem('Áo Da Rồng Xanh', 'armor', 'rare', 50, 'archer', '🥋', { hp: 380, def: 75 }, 'Áo da dẻo dai chống chịu gai độc.'),
    pants: createItem('Quần Vải Rừng', 'pants', 'uncommon', 30, 'archer', '👖', { hp: 160, def: 35 }, 'Thoải mái khi leo trèo phục kích.'),
    boots: createItem('Giày Thần Gió', 'boots', 'rare', 45, 'archer', '👢', { hp: 140, speed: 0.2 }, 'Nhẹ nhàng lướt trên ngọn cỏ.'),
    necklace: createItem('Dây Chuyền Mắt Đại Bàng', 'necklace', 'rare', 45, 'archer', '📿', { atk: 48, crit: 8 }, 'Tăng thị lực và cự ly quan sát.'),
    earring: null,
    ring1: createItem('Nhẫn Xuyên Phá', 'ring1', 'rare', 40, 'archer', '💍', { atk: 60, crit: 7 }, 'Tăng khả năng xuyên thủng giáp mục tiêu.'),
    ring2: null,
    bracelet1: null,
    bracelet2: null
  };
}

// Khởi tạo trạng thái rỗng chưa mặc đồ cho nhân vật mới
export function generateEmptyEquipped() {
  return {
    main_weapon: null,
    sub_weapon: null,
    helmet: null,
    armor: null,
    pants: null,
    boots: null,
    necklace: null,
    earring: null,
    ring1: null,
    ring2: null,
    bracelet1: null,
    bracelet2: null
  };
}

// Khởi tạo danh sách Túi Đồ (Inventory) ban đầu với các trang bị cơ bản Lv.1 để người chơi thử nghiệm
export function generateStarterInventory() {
  return [
    createItem('Kiếm Gỗ Tập Sự', 'main_weapon', 'common', 1, 'warrior', '⚔️', { atk: 4 }, 'Thanh kiếm gỗ sơ cấp cho chiến binh mới nhập môn.'),
    createItem('Cung Gỗ Nhỏ', 'main_weapon', 'common', 1, 'archer', '🏹', { atk: 4 }, 'Cung săn thú nhỏ bằng gỗ phong.'),
    createItem('Gậy Phép Cũ', 'main_weapon', 'common', 1, 'mage', '🪄', { atk: 5 }, 'Cành cây ngâm ma lực nhẹ dành cho pháp sư tập sự.'),
    createItem('Áo Vải Thô', 'armor', 'common', 1, 'all', '🥋', { hp: 20, def: 2 }, 'Áo may từ vải thô, bảo vệ cơ bản.'),
    createItem('Mũ Da Cũ', 'helmet', 'common', 1, 'all', '🪖', { hp: 12, def: 1 }, 'Mũ da thuộc đơn sơ che mưa nắng.'),
    createItem('Ủng Da Mòn', 'boots', 'common', 1, 'all', '👢', { hp: 10, speed: 0.05 }, 'Đôi giày vải giúp bước chân linh hoạt hơn.'),
    createItem('Nhẫn Đồng Cũ', 'ring', 'common', 1, 'all', '💍', { atk: 2, crit: 2 }, 'Chiếc nhẫn đồng rỉ sét chứa chút sinh khí.'),
    createItem('Vòng Tay Dây Thừng', 'bracelet', 'common', 1, 'all', '🧿', { hp: 15, regen: 1 }, 'Vòng bện từ dây cỏ may mắn.')
  ];
}

// Hệ thống rớt đồ khi tiêu diệt quái vật hoặc Boss
export function generateLootDrop(stage, subStage, isBoss, wave = 1) {
  const isDrop = isBoss || Math.random() < 0.18; // Boss 100% rớt, quái thường 18%
  if (!isDrop) return null;

  const baseLevel = Math.max(1, (stage - 1) * 10 + subStage + Math.floor(Math.random() * 2));

  // Tỉ lệ phẩm chất
  let rarity = 'common';
  const roll = Math.random() * 100;
  if (isBoss) {
    if (roll < 15) rarity = 'legendary';
    else if (roll < 55) rarity = 'epic';
    else rarity = 'rare';
  } else {
    if (roll < 2) rarity = 'legendary';
    else if (roll < 8) rarity = 'epic';
    else if (roll < 25) rarity = 'rare';
    else if (roll < 60) rarity = 'uncommon';
    else rarity = 'common';
  }

  const slotKeys = ['main_weapon', 'sub_weapon', 'helmet', 'armor', 'pants', 'boots', 'necklace', 'earring', 'ring', 'bracelet'];
  const chosenSlot = slotKeys[Math.floor(Math.random() * slotKeys.length)];

  const slotIcons = {
    main_weapon: ['⚔️', '🗡️', '🏹', '🪄'],
    sub_weapon: ['🛡️', '🔮', '🎯', '📖'],
    helmet: ['🪖', '🧙', '👒', '👑'],
    armor: ['🥋', '👘', '🦺', '🧥'],
    pants: ['👖', '🩳'],
    boots: ['👢', '👞', '🥾'],
    necklace: ['📿', '🧿'],
    earring: ['💎', '✨'],
    ring: ['💍', '🪐'],
    bracelet: ['🧿', '⛓️']
  };

  const icons = slotIcons[chosenSlot] || ['🎁'];
  const icon = icons[Math.floor(Math.random() * icons.length)];

  const prefixNames = ['Rừng Sâu', 'Bóng Đêm', 'Ánh Sáng', 'Lôi Thần', 'Băng Giá', 'Nham Thạch', 'Cổ Đại', 'Hoàng Gia'];
  const pName = prefixNames[Math.floor(Math.random() * prefixNames.length)];

  const slotDisplay = EQUIP_SLOTS[chosenSlot]?.name || 'Trang Bị';
  const itemName = `${slotDisplay} ${pName}`;

  return createItem(itemName, chosenSlot, rarity, baseLevel, 'all', icon);
}
