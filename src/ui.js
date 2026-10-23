import { gameState } from './state.js';
import { sounds } from './audio.js';
import { EQUIP_SLOTS, RARITY_DEFS } from './items.js';

export class UIManager {
  constructor(phaserGame) {
    this.game = phaserGame;
    this.isTaskbarMode = false;
    this.viewWorld = gameState.data.stage;
    this.inspectCharId = gameState.activeCharId; // Nhân vật đang được xem stats bên trái

    this.isStatusVisible = false;
    this.isMapVisible = false;
    this.isUpgradesModalVisible = false;
    this.isItemDetailVisible = false;

    this.inventoryFilter = 'all'; // 'all' | 'gear' | 'accessory'
    this.selectedItemContext = null; // { item, isEquipped, charId, slotKey, invIndex }

    this.initElements();
    this.bindEvents();
    this.update();
  }

  initElements() {
    this.appContainer = document.getElementById('app');
    this.panelBackdrop = document.getElementById('panel-backdrop');

    // Sidebars
    this.sidebarStatus = document.getElementById('sidebar-status');
    this.sidebarMap = document.getElementById('sidebar-map');
    this.btnCloseStatus = document.getElementById('btn-close-status');
    this.btnCloseMap = document.getElementById('btn-close-map');

    // Top & Bottom Toggles
    this.muteBtn = document.getElementById('btn-mute');
    this.modeBtn = document.getElementById('btn-toggle-mode');
    this.resetBtn = document.getElementById('btn-reset');
    this.btnToggleStatus = document.getElementById('btn-toggle-status');
    this.btnToggleMap = document.getElementById('btn-toggle-map');

    // Character Switcher Bar Tabs
    this.charTabs = {
      warrior: document.getElementById('tab-char-warrior'),
      archer: document.getElementById('tab-char-archer'),
      mage: document.getElementById('tab-char-mage')
    };

    this.tabLvls = {
      warrior: document.getElementById('tab-lvl-warrior'),
      archer: document.getElementById('tab-lvl-archer'),
      mage: document.getElementById('tab-lvl-mage')
    };

    // Status Panel Class Tabs
    this.statusTabs = {
      warrior: document.getElementById('status-tab-warrior'),
      archer: document.getElementById('status-tab-archer'),
      mage: document.getElementById('status-tab-mage')
    };

    // Status Panel Info
    this.statusHeroAvatar = document.getElementById('status-hero-avatar');
    this.statusAvatarBox = document.getElementById('status-avatar-box');
    this.statusHeroName = document.getElementById('status-hero-name');
    this.statusHeroTitle = document.getElementById('status-hero-title');
    this.statusHeroRole = document.getElementById('status-hero-role');
    this.statusLevelBadge = document.getElementById('status-level-badge');
    this.statusRoleSubtitle = document.getElementById('status-role-subtitle');

    this.statValDamage = document.getElementById('stat-val-damage');
    this.statDetailDamage = document.getElementById('stat-detail-damage');
    this.statValHp = document.getElementById('stat-val-hp');
    this.statValRegen = document.getElementById('stat-val-regen');
    this.statValAttackSpeed = document.getElementById('stat-val-attackspeed');
    this.statBuffFrenzy = document.getElementById('stat-buff-frenzy');
    this.statValCritChance = document.getElementById('stat-val-critchance');
    this.statValCritMult = document.getElementById('stat-val-critmult');
    this.statValClickDamage = document.getElementById('stat-val-clickdamage');
    this.statValGoldMult = document.getElementById('stat-val-goldmult');
    this.statRecordKills = document.getElementById('stat-record-kills');
    this.statRecordBosses = document.getElementById('stat-record-bosses');
    this.statRecordMaxStage = document.getElementById('stat-record-maxstage');

    // HUD Elements
    this.hudCharIcon = document.getElementById('hud-char-icon');
    this.hudGold = document.getElementById('hud-gold');
    this.hudLevel = document.getElementById('hud-level');
    this.hudExpFill = document.getElementById('hud-exp-fill');
    this.hudExpText = document.getElementById('hud-exp-text');
    this.hudStage = document.getElementById('hud-stage');
    this.hudStageBadge = document.getElementById('hud-stage-badge');
    this.hudModeBadge = document.getElementById('hud-mode-badge');
    this.hudHpLabel = document.getElementById('hud-hp-label');
    this.hudHpFill = document.getElementById('hud-hp-fill');
    this.hudHpText = document.getElementById('hud-hp-text');

    // Viewport Skills Dock Elements
    this.skillButtons = {
      skill1: document.getElementById('skill-btn-1'),
      skill2: document.getElementById('skill-btn-2'),
      skill3: document.getElementById('skill-btn-3')
    };

    this.skillIcons = {
      skill1: document.getElementById('skill-icon-1'),
      skill2: document.getElementById('skill-icon-2'),
      skill3: document.getElementById('skill-icon-3')
    };

    this.skillNames = {
      skill1: document.getElementById('skill-name-1'),
      skill2: document.getElementById('skill-name-2'),
      skill3: document.getElementById('skill-name-3')
    };

    // Hero & Inventory Console Elements
    this.heroDisplayClassName = document.getElementById('hero-display-class-name');
    this.heroPortraitCanvas = document.getElementById('hero-portrait-canvas');
    this.heroDisplayLevel = document.getElementById('hero-display-level');
    this.heroDisplayExpFill = document.getElementById('hero-display-exp-fill');
    this.btnPrevHeroClass = document.getElementById('btn-prev-hero-class');
    this.btnNextHeroClass = document.getElementById('btn-next-hero-class');
    this.btnOpenUpgrades = document.getElementById('btn-open-upgrades');
    this.btnAutoEquip = document.getElementById('btn-auto-equip');

    // Equipment Slots mapping (12 slots)
    this.equipSlotElements = {};
    const slotEls = document.querySelectorAll('.equip-slot-item');
    slotEls.forEach((el) => {
      const slotKey = el.dataset.slot;
      if (slotKey) {
        this.equipSlotElements[slotKey] = el;
      }
    });

    // 3 Class Cards & 2 Hex Skill slots
    this.heroClassCards = document.querySelectorAll('.hero-class-card-item');
    this.heroCardLvls = {
      warrior: document.getElementById('card-hero-lvl-warrior'),
      archer: document.getElementById('card-hero-lvl-archer'),
      mage: document.getElementById('card-hero-lvl-mage')
    };

    this.heroHexSkills = {
      skill1: document.getElementById('hero-slot-skill-1'),
      skill2: document.getElementById('hero-slot-skill-2')
    };
    this.heroHexIcons = {
      skill1: document.getElementById('hero-hex-icon-1'),
      skill2: document.getElementById('hero-hex-icon-2')
    };
    this.heroHexCds = {
      skill1: document.getElementById('hero-hex-cd-1'),
      skill2: document.getElementById('hero-hex-cd-2')
    };

    // Inventory elements
    this.inventoryGrid = document.getElementById('inventory-grid');
    this.invCapacityCounter = document.getElementById('inv-capacity-counter');
    this.invFilterTabs = document.querySelectorAll('.inv-filter-tab[data-filter]');
    this.btnQuickSell = document.getElementById('btn-quick-sell');

    // Modal Upgrades
    this.modalUpgrades = document.getElementById('modal-upgrades');
    this.modalUpgradesTitle = document.getElementById('modal-upgrades-title');
    this.btnCloseUpgrades = document.getElementById('btn-close-upgrades');
    this.upgradesContainer = document.getElementById('upgrades-container');

    // Modal Item Detail
    this.modalItemDetail = document.getElementById('modal-item-detail');
    this.btnCloseItemDetail = document.getElementById('btn-close-item-detail');
    this.itemDetailIconWrap = document.getElementById('item-detail-icon-wrap');
    this.itemDetailIcon = document.getElementById('item-detail-icon');
    this.itemDetailName = document.getElementById('item-detail-name');
    this.itemDetailType = document.getElementById('item-detail-type');
    this.itemDetailRarity = document.getElementById('item-detail-rarity');
    this.itemDetailLvl = document.getElementById('item-detail-lvl');
    this.itemDetailStats = document.getElementById('item-detail-stats');
    this.itemDetailDesc = document.getElementById('item-detail-desc');
    this.btnItemActionEquip = document.getElementById('btn-item-action-equip');
    this.btnItemActionEnhance = document.getElementById('btn-item-action-enhance');
    this.btnItemActionSell = document.getElementById('btn-item-action-sell');

    // Map Panel Elements
    this.mapWorldTitle = document.getElementById('map-world-title');
    this.mapStagesTitle = document.getElementById('map-stages-title');
    this.mapProgressCount = document.getElementById('map-progress-count');
    this.mapStagesList = document.getElementById('map-stages-list');
    this.btnPrevWorld = document.getElementById('btn-prev-world');
    this.btnNextWorld = document.getElementById('btn-next-world');
    this.btnReturnCurrent = document.getElementById('btn-return-current-stage');
    this.btnToggleAutoAdvance = document.getElementById('btn-toggle-autoadvance');
    this.bossAlertBox = document.getElementById('boss-alert-box');
    this.btnChallengeBoss = document.getElementById('btn-challenge-boss');
    this.chkAutoBoss = document.getElementById('chk-auto-boss');

    this.highestKnownStage = gameState.data.stage;
    this.renderedWorld = null;
  }

  bindEvents() {
    // 1. Subscribe vào state changes
    gameState.subscribe(() => {
      if (gameState.data.stage > this.highestKnownStage) {
        this.highestKnownStage = gameState.data.stage;
        this.viewWorld = gameState.data.stage;
      }
      this.update();
    });

    // 2. Chuyển đổi Class nhân vật từ Switcher Bar
    const classIds = ['warrior', 'archer', 'mage'];
    for (const cid of classIds) {
      if (this.charTabs[cid]) {
        this.charTabs[cid].addEventListener('click', () => {
          this.switchHeroClass(cid);
        });
      }
      if (this.statusTabs[cid]) {
        this.statusTabs[cid].addEventListener('click', () => {
          this.inspectCharId = cid;
          this.renderStatusPanel();
        });
      }
    }

    // 3. 3 Class Cards trong Hero Console
    this.heroClassCards.forEach((card) => {
      card.addEventListener('click', () => {
        const charId = card.dataset.char;
        if (charId) {
          this.switchHeroClass(charId);
        }
      });
    });

    // 4. Hero Class Prev / Next buttons
    const classList = ['warrior', 'archer', 'mage'];
    if (this.btnPrevHeroClass) {
      this.btnPrevHeroClass.addEventListener('click', () => {
        const curIdx = classList.indexOf(gameState.activeCharId);
        const prevIdx = (curIdx - 1 + classList.length) % classList.length;
        this.switchHeroClass(classList[prevIdx]);
      });
    }

    if (this.btnNextHeroClass) {
      this.btnNextHeroClass.addEventListener('click', () => {
        const curIdx = classList.indexOf(gameState.activeCharId);
        const nextIdx = (curIdx + 1) % classList.length;
        this.switchHeroClass(classList[nextIdx]);
      });
    }

    // 5. Open / Close Upgrades Modal
    if (this.btnOpenUpgrades) {
      this.btnOpenUpgrades.addEventListener('click', () => {
        this.openUpgradesModal();
      });
    }

    if (this.btnCloseUpgrades) {
      this.btnCloseUpgrades.addEventListener('click', () => {
        this.closeUpgradesModal();
      });
    }

    if (this.modalUpgrades) {
      this.modalUpgrades.addEventListener('click', (e) => {
        if (e.target === this.modalUpgrades) {
          this.closeUpgradesModal();
        }
      });
    }

    // 6. Auto-Equip Button
    if (this.btnAutoEquip) {
      this.btnAutoEquip.addEventListener('click', () => {
        const count = gameState.autoEquip(gameState.activeCharId);
        sounds.playCoin();
        this.update();
      });
    }

    // 7. Equipment Slots clicks
    for (const slotKey in this.equipSlotElements) {
      const el = this.equipSlotElements[slotKey];
      el.addEventListener('click', () => {
        const activeChar = gameState.activeChar;
        const item = activeChar.equipped ? activeChar.equipped[slotKey] : null;
        if (item) {
          this.openItemDetail(item, {
            isEquipped: true,
            charId: gameState.activeCharId,
            slotKey
          });
        }
      });
    }

    // 8. Inventory Filters
    this.invFilterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        this.invFilterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        this.inventoryFilter = tab.dataset.filter || 'all';
        this.renderInventoryGrid();
      });
    });

    // 9. Quick Sell Common / Uncommon items
    if (this.btnQuickSell) {
      this.btnQuickSell.addEventListener('click', () => {
        const inv = gameState.data.inventory;
        const junkIndices = [];
        for (let i = inv.length - 1; i >= 0; i--) {
          if (inv[i].rarity === 'common' || inv[i].rarity === 'uncommon') {
            junkIndices.push(i);
          }
        }

        if (junkIndices.length === 0) {
          alert('Không có trang bị Thường hoặc Tốt nào trong túi!');
          return;
        }

        if (confirm(`Bạn có chắc muốn bán nhanh ${junkIndices.length} món đồ Thường/Tốt để lấy Vàng?`)) {
          let totalGold = 0;
          junkIndices.forEach((idx) => {
            const res = gameState.sellItem(idx);
            if (res && res.gold) totalGold += res.gold;
          });
          sounds.playCoin();
          this.update();
        }
      });
    }

    // 10. Modal Item Detail Actions
    if (this.btnCloseItemDetail) {
      this.btnCloseItemDetail.addEventListener('click', () => {
        this.closeItemDetail();
      });
    }

    if (this.modalItemDetail) {
      this.modalItemDetail.addEventListener('click', (e) => {
        if (e.target === this.modalItemDetail) {
          this.closeItemDetail();
        }
      });
    }

    if (this.btnItemActionEquip) {
      this.btnItemActionEquip.addEventListener('click', () => {
        if (!this.selectedItemContext) return;
        const ctx = this.selectedItemContext;

        if (ctx.isEquipped) {
          // Tháo trang bị
          const res = gameState.unequipItem(ctx.charId, ctx.slotKey);
          if (res && res.success) {
            sounds.playCoin();
            this.closeItemDetail();
            this.update();
          } else if (res && res.reason) {
            alert(res.reason);
          }
        } else {
          // Mặc trang bị
          const res = gameState.equipItem(gameState.activeCharId, ctx.invIndex);
          if (res && res.success) {
            sounds.playCoin();
            this.closeItemDetail();
            this.update();
          } else if (res && res.reason) {
            alert(res.reason);
          }
        }
      });
    }

    if (this.btnItemActionEnhance) {
      this.btnItemActionEnhance.addEventListener('click', () => {
        if (!this.selectedItemContext) return;
        const ctx = this.selectedItemContext;

        if (ctx.isEquipped) {
          const res = gameState.enhanceItem(ctx.charId, ctx.slotKey);
          if (res && res.success) {
            sounds.playLevelUp();
            this.openItemDetail(res.item, ctx);
            this.update();
          } else if (res && res.reason) {
            alert(res.reason);
          }
        } else {
          alert('Hãy mặc trang bị vào người trước khi Cường Hoá!');
        }
      });
    }

    if (this.btnItemActionSell) {
      this.btnItemActionSell.addEventListener('click', () => {
        if (!this.selectedItemContext) return;
        const ctx = this.selectedItemContext;

        if (ctx.isEquipped) {
          alert('Không thể bán trang bị đang mặc trên người! Hãy Tháo Đồ ra trước.');
        } else {
          const res = gameState.sellItem(ctx.invIndex);
          if (res && res.success) {
            sounds.playCoin();
            this.closeItemDetail();
            this.update();
          }
        }
      });
    }

    // 11. Mute audio toggle
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        const isMuted = sounds.toggleMute();
        this.muteBtn.innerHTML = isMuted ? '🔇 Tắt âm' : '🔊 Âm thanh';
        this.muteBtn.classList.toggle('muted', isMuted);
      });
    }

    // 12. Toggle Taskbar Mode vs Window Mode
    if (this.modeBtn) {
      this.modeBtn.addEventListener('click', () => {
        this.toggleTaskbarMode();
      });
    }

    // 13. Reset game
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xoá dữ liệu và chơi lại từ đầu?')) {
          gameState.reset();
        }
      });
    }

    // 14. Bottom Buttons: Bật/Tắt Map & Status
    if (this.btnToggleStatus) {
      this.btnToggleStatus.addEventListener('click', () => {
        this.toggleStatusPanel();
      });
    }

    if (this.btnToggleMap) {
      this.btnToggleMap.addEventListener('click', () => {
        this.toggleMapPanel();
      });
    }

    if (this.btnCloseStatus) {
      this.btnCloseStatus.addEventListener('click', () => {
        this.toggleStatusPanel(false);
      });
    }

    if (this.btnCloseMap) {
      this.btnCloseMap.addEventListener('click', () => {
        this.toggleMapPanel(false);
      });
    }

    if (this.panelBackdrop) {
      this.panelBackdrop.addEventListener('click', () => {
        this.toggleStatusPanel(false);
        this.toggleMapPanel(false);
      });
    }

    // 15. World Switcher trong Map (◀ / ▶)
    if (this.btnPrevWorld) {
      this.btnPrevWorld.addEventListener('click', () => {
        if (this.viewWorld > 1) {
          this.viewWorld -= 1;
          sounds.playSlash();
          this.renderMapPanel();
        }
      });
    }

    if (this.btnNextWorld) {
      this.btnNextWorld.addEventListener('click', () => {
        if (this.viewWorld < gameState.data.maxUnlockedStage) {
          this.viewWorld += 1;
          sounds.playSlash();
          this.renderMapPanel();
        }
      });
    }

    if (this.btnReturnCurrent) {
      this.btnReturnCurrent.addEventListener('click', () => {
        this.viewWorld = gameState.data.stage;
        sounds.playCoin();
        this.renderMapPanel();
      });
    }

    // 16. Boss alert action: Khiêu chiến Boss 1-10
    if (this.btnChallengeBoss) {
      this.btnChallengeBoss.addEventListener('click', () => {
        gameState.challengeBoss();
        this.viewWorld = gameState.data.stage;
        window.dispatchEvent(new CustomEvent('stage-selected'));
      });
    }

    if (this.chkAutoBoss) {
      this.chkAutoBoss.checked = gameState.data.autoChallengeBoss;
      this.chkAutoBoss.addEventListener('change', () => {
        gameState.toggleAutoChallengeBoss();
      });
    }

    // 17. Toggle Auto-Advance vs Repeat stage
    if (this.btnToggleAutoAdvance) {
      this.btnToggleAutoAdvance.addEventListener('click', () => {
        gameState.toggleAutoAdvance();
        sounds.playCoin();
      });
    }

    // 18. Skills dock and Hex skills button clicks
    for (const sk of ['skill1', 'skill2', 'skill3']) {
      if (this.skillButtons[sk]) {
        this.skillButtons[sk].addEventListener('click', () => this.triggerSkill(sk));
      }
    }

    if (this.heroHexSkills.skill1) {
      this.heroHexSkills.skill1.addEventListener('click', () => this.triggerSkill('skill1'));
    }
    if (this.heroHexSkills.skill2) {
      this.heroHexSkills.skill2.addEventListener('click', () => this.triggerSkill('skill2'));
    }

    // 19. Phím tắt
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (e.key === 'Escape') {
        this.toggleStatusPanel(false);
        this.toggleMapPanel(false);
        this.closeUpgradesModal();
        this.closeItemDetail();
      } else if (key === 'z') {
        this.switchHeroClass('warrior');
      } else if (key === 'x') {
        this.switchHeroClass('archer');
      } else if (key === 'c') {
        this.switchHeroClass('mage');
      } else if (e.key === '1' || key === 'q') {
        this.triggerSkill('skill1');
      } else if (e.key === '2' || key === 'w') {
        this.triggerSkill('skill2');
      } else if (e.key === '3' || key === 'e') {
        this.triggerSkill('skill3');
      } else if (key === 't') {
        this.toggleTaskbarMode();
      } else if (key === 's') {
        this.toggleStatusPanel();
      } else if (key === 'm') {
        this.toggleMapPanel();
      }
    });

    // 20. Cooldown animation loop
    const loop = () => {
      this.updateSkillCooldowns();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  switchHeroClass(charId) {
    if (gameState.switchCharacter(charId)) {
      this.inspectCharId = charId;
      sounds.playCoin();
      window.dispatchEvent(new CustomEvent('character-switched', { detail: charId }));
      this.update();
    }
  }

  toggleStatusPanel(forceState) {
    this.isStatusVisible = (typeof forceState === 'boolean') ? forceState : !this.isStatusVisible;
    if (this.sidebarStatus) {
      this.sidebarStatus.classList.toggle('open', this.isStatusVisible);
    }
    if (this.btnToggleStatus) {
      this.btnToggleStatus.classList.toggle('active', this.isStatusVisible);
    }
    this.updateBackdrop();
  }

  toggleMapPanel(forceState) {
    this.isMapVisible = (typeof forceState === 'boolean') ? forceState : !this.isMapVisible;
    if (this.sidebarMap) {
      this.sidebarMap.classList.toggle('open', this.isMapVisible);
    }
    if (this.btnToggleMap) {
      this.btnToggleMap.classList.toggle('active', this.isMapVisible);
    }
    this.updateBackdrop();
  }

  openUpgradesModal() {
    this.isUpgradesModalVisible = true;
    if (this.modalUpgrades) {
      this.modalUpgrades.classList.remove('hidden');
      this.renderUpgrades();
    }
  }

  closeUpgradesModal() {
    this.isUpgradesModalVisible = false;
    if (this.modalUpgrades) {
      this.modalUpgrades.classList.add('hidden');
    }
  }

  openItemDetail(item, context) {
    if (!item || !this.modalItemDetail) return;
    this.selectedItemContext = { item, ...context };
    this.isItemDetailVisible = true;

    const rDef = RARITY_DEFS[item.rarity] || RARITY_DEFS.common;
    const slotDef = EQUIP_SLOTS[item.slot] || { name: 'Trang Bị' };

    if (this.itemDetailIconWrap) {
      this.itemDetailIconWrap.className = `item-detail-icon-box rarity-${item.rarity}`;
    }
    if (this.itemDetailIcon) this.itemDetailIcon.textContent = item.icon || '⚔️';

    if (this.itemDetailName) {
      this.itemDetailName.textContent = item.name;
      this.itemDetailName.style.color = rDef.color;
    }

    if (this.itemDetailType) this.itemDetailType.textContent = slotDef.name;
    if (this.itemDetailRarity) {
      this.itemDetailRarity.textContent = rDef.name;
      this.itemDetailRarity.style.color = rDef.color;
      this.itemDetailRarity.style.borderColor = rDef.border;
    }
    if (this.itemDetailLvl) this.itemDetailLvl.textContent = `Lv. ${item.level}`;

    // Render Stats
    if (this.itemDetailStats) {
      this.itemDetailStats.innerHTML = '';
      const statMap = [
        { key: 'atk', label: 'Tấn Công', icon: '⚔️', val: item.stats.atk },
        { key: 'hp', label: 'Máu Tối Đa', icon: '❤️', val: item.stats.hp },
        { key: 'def', label: 'Giáp Phòng Thủ', icon: '🛡️', val: item.stats.def },
        { key: 'crit', label: 'Tỉ Lệ Bạo Kích', icon: '🎯', val: item.stats.crit ? `+${item.stats.crit}%` : null },
        { key: 'speed', label: 'Tốc Độ Đánh', icon: '⚡', val: item.stats.speed ? `+${item.stats.speed}/s` : null },
        { key: 'regen', label: 'Hồi Phục Máu', icon: '💖', val: item.stats.regen ? `+${item.stats.regen}/s` : null }
      ];

      for (const st of statMap) {
        if (st.val) {
          const row = document.createElement('div');
          row.className = 'item-stat-row';
          row.innerHTML = `
            <span class="stat-meta"><span class="stat-icon">${st.icon}</span> ${st.label}:</span>
            <span class="stat-val font-bold text-accent">+${st.val}</span>
          `;
          this.itemDetailStats.appendChild(row);
        }
      }
    }

    if (this.itemDetailDesc) {
      this.itemDetailDesc.textContent = item.desc || `Vật phẩm phẩm chất ${rDef.name}. Cung cấp chỉ số gia tăng sức mạnh.`;
    }

    // Cập nhật button actions
    if (this.btnItemActionEquip) {
      if (context.isEquipped) {
        this.btnItemActionEquip.innerHTML = '🛡️ Tháo Đồ';
        this.btnItemActionEquip.className = 'btn-item-action btn-unequip';
      } else {
        this.btnItemActionEquip.innerHTML = '🗡️ Mặc Vào';
        this.btnItemActionEquip.className = 'btn-item-action btn-equip';
      }
    }

    if (this.btnItemActionEnhance) {
      const enhanceCost = Math.round(item.level * 50);
      this.btnItemActionEnhance.innerHTML = `⚡ Cường Hoá (${enhanceCost.toLocaleString('vi-VN')} 💰)`;
      this.btnItemActionEnhance.disabled = !context.isEquipped || (gameState.data.gold < enhanceCost);
    }

    if (this.btnItemActionSell) {
      const sellPrice = item.value || Math.round(item.level * 25);
      this.btnItemActionSell.innerHTML = `💰 Bán (${sellPrice.toLocaleString('vi-VN')} Vàng)`;
      this.btnItemActionSell.disabled = !!context.isEquipped;
    }

    this.modalItemDetail.classList.remove('hidden');
  }

  closeItemDetail() {
    this.isItemDetailVisible = false;
    this.selectedItemContext = null;
    if (this.modalItemDetail) {
      this.modalItemDetail.classList.add('hidden');
    }
  }

  updateBackdrop() {
    if (this.panelBackdrop) {
      const hasAnyOpen = this.isStatusVisible || this.isMapVisible;
      const isMobileOrTablet = window.innerWidth <= 1380;
      this.panelBackdrop.classList.toggle('hidden', !hasAnyOpen || !isMobileOrTablet);
    }
  }

  triggerSkill(skillKey) {
    if (gameState.useSkill(skillKey)) {
      sounds.playSlash();
      window.dispatchEvent(new CustomEvent('use-skill-active', { detail: skillKey }));
      this.update();
    }
  }

  toggleTaskbarMode() {
    this.isTaskbarMode = !this.isTaskbarMode;
    document.body.classList.toggle('taskbar-mode', this.isTaskbarMode);

    if (this.modeBtn) {
      this.modeBtn.innerHTML = this.isTaskbarMode ? '🖥️ Phóng to' : '💻 Dạng Taskbar';
    }

    if (this.isTaskbarMode) {
      this.toggleStatusPanel(false);
      this.toggleMapPanel(false);
      this.closeUpgradesModal();
      this.closeItemDetail();
    }

    setTimeout(() => {
      const container = document.getElementById('game-container');
      if (container && this.game) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        this.game.scale.resize(w, h);
      }
    }, 60);
  }

  update() {
    const activeChar = gameState.activeChar;
    const activeMeta = gameState.activeCharMeta;

    // 1. Cập nhật Switcher Tabs
    for (const cid of ['warrior', 'archer', 'mage']) {
      const isAct = gameState.activeCharId === cid;
      if (this.charTabs[cid]) {
        this.charTabs[cid].classList.toggle('active', isAct);
      }
      if (this.tabLvls[cid]) {
        this.tabLvls[cid].textContent = `Lv.${gameState.data.characters[cid].level}`;
      }
      if (this.statusTabs[cid]) {
        this.statusTabs[cid].classList.toggle('active', this.inspectCharId === cid);
      }
    }

    // 2. HUD Bar
    if (this.hudGold) this.hudGold.textContent = gameState.data.gold.toLocaleString('vi-VN');
    if (this.hudCharIcon) this.hudCharIcon.textContent = activeMeta.avatar;
    if (this.hudLevel) this.hudLevel.textContent = `Lv.${activeChar.level}`;

    if (this.hudExpFill && this.hudExpText) {
      const expPercent = Math.min(100, Math.floor((activeChar.exp / gameState.maxExp) * 100));
      this.hudExpFill.style.width = `${expPercent}%`;
      this.hudExpText.textContent = `${activeChar.exp}/${gameState.maxExp} EXP`;
    }

    if (this.hudStage) {
      this.hudStage.textContent = `Ải ${gameState.data.stage}-${gameState.data.subStage}`;
    }

    if (this.hudStageBadge) {
      const isBoss = (gameState.data.currentWave === 10);
      if (isBoss) {
        const isWorldBoss = gameState.data.subStage === 10;
        this.hudStageBadge.textContent = isWorldBoss ? '👑 TRÙM THẾ GIỚI (Wave 10)' : '👑 TRÙM ẢI (Wave 10)';
        this.hudStageBadge.className = 'stage-badge boss';
      } else if (gameState.data.isFarmingAfterBossLoss) {
        this.hudStageBadge.textContent = '🌾 Treo Farm (Wave 9)';
        this.hudStageBadge.className = 'stage-badge farm';
      } else {
        this.hudStageBadge.textContent = `🌿 Wave ${gameState.data.currentWave || 1}/10`;
        this.hudStageBadge.className = 'stage-badge';
      }
    }

    if (this.hudModeBadge) {
      const isAuto = gameState.data.autoAdvanceStage !== false;
      this.hudModeBadge.textContent = isAuto ? '⏩ Tiến ải' : '🔁 Treo ải';
      this.hudModeBadge.className = `stage-mode-badge ${isAuto ? 'mode-auto' : 'mode-repeat'}`;
      this.hudModeBadge.title = isAuto ? 'Chế độ: Tự động qua ải khi hạ gục quái' : 'Chế độ: Đang treo máy cố định ở ải này';
    }

    // Hero HP Bar
    if (this.hudHpLabel) this.hudHpLabel.textContent = `Máu ${activeMeta.name}`;
    if (this.hudHpFill && this.hudHpText) {
      const hpPercent = Math.max(0, Math.min(100, (gameState.currentHp / gameState.maxHp) * 100));
      this.hudHpFill.style.width = `${hpPercent}%`;
      this.hudHpText.textContent = `${Math.ceil(gameState.currentHp)} / ${gameState.maxHp} HP`;
    }

    // 3. Skills Bar theo Class active
    this.renderSkillsDock();

    // 4. Hero & Inventory Console (TaskBarHero Layout)
    this.renderHeroConsole();
    this.renderInventoryGrid();

    // 5. Render Bảng Status
    this.renderStatusPanel();

    // 6. Render Upgrades Modal (nếu đang mở)
    if (this.isUpgradesModalVisible) {
      this.renderUpgrades();
    }

    // 7. Render Bảng Map
    this.renderMapPanel();
  }

  // ==================== RENDER HERO CONSOLE (TASKBARHERO LAYOUT) ====================
  renderHeroConsole() {
    const cid = gameState.activeCharId;
    const char = gameState.activeChar;
    const meta = gameState.activeCharMeta;

    // 1. Tên Class hiển thị ở giữa
    if (this.heroDisplayClassName) {
      let titleName = 'Sorcerer';
      if (cid === 'warrior') titleName = 'Warrior';
      if (cid === 'archer') titleName = 'Archer';
      this.heroDisplayClassName.textContent = `${titleName} (${meta.name})`;
    }

    // 2. Chân dung Pixel-Art Anime của nhân vật
    this.renderHeroPortrait(cid);

    // 3. Level & EXP dưới chân dung
    if (this.heroDisplayLevel) {
      this.heroDisplayLevel.textContent = `Lv.${char.level}`;
    }
    if (this.heroDisplayExpFill) {
      const pct = Math.min(100, Math.floor((char.exp / gameState.maxExp) * 100));
      this.heroDisplayExpFill.style.width = `${pct}%`;
    }

    // 4. 12 Ô Trang Bị (6 bên trái + 6 bên phải)
    const equipped = char.equipped || {};
    for (const slotKey in this.equipSlotElements) {
      const slotEl = this.equipSlotElements[slotKey];
      const slotDef = EQUIP_SLOTS[slotKey] || { name: slotKey, icon: '⚔️', placeholder: '⚔️' };
      const item = equipped[slotKey];

      // Reset classes
      slotEl.className = 'equip-slot-item';

      if (item) {
        slotEl.classList.add(`rarity-${item.rarity}`, 'has-item');
        slotEl.title = `${item.name} (Lv. ${item.level}) - Phẩm chất: ${RARITY_DEFS[item.rarity]?.name || ''}\nNhấp để xem chi tiết / tháo`;

        slotEl.innerHTML = `
          <span class="slot-lock">🔒</span>
          <div class="slot-item-icon-box">
            <span class="slot-item-icon">${item.icon}</span>
          </div>
          <span class="slot-item-lvl">Lv. ${item.level}</span>
          <span class="slot-tag-badge">${slotDef.name}</span>
        `;
      } else {
        slotEl.classList.add('empty-slot');
        slotEl.title = `Ô ${slotDef.name} (Chưa trang bị)`;
        slotEl.innerHTML = `
          <span class="slot-placeholder">${slotDef.placeholder || slotDef.icon}</span>
          <span class="slot-tag">${slotDef.name}</span>
        `;
      }
    }

    // 5. 3 Class Cards
    this.heroClassCards.forEach((card) => {
      const cardChar = card.dataset.char;
      const isActive = cardChar === cid;
      card.classList.toggle('active', isActive);
      if (this.heroCardLvls[cardChar]) {
        this.heroCardLvls[cardChar].textContent = `Lv.${gameState.data.characters[cardChar]?.level || 1}`;
      }
    });

    // 6. 2 Hex Skill slots
    const skills = gameState.currentSkillDefs;
    if (skills.length >= 2) {
      if (this.heroHexIcons.skill1) this.heroHexIcons.skill1.textContent = skills[0].icon;
      if (this.heroHexIcons.skill2) this.heroHexIcons.skill2.textContent = skills[1].icon;
      if (this.heroHexSkills.skill1) this.heroHexSkills.skill1.title = `${skills[0].name}: ${skills[0].desc} [Phím 1]`;
      if (this.heroHexSkills.skill2) this.heroHexSkills.skill2.title = `${skills[1].name}: ${skills[1].desc} [Phím 2]`;
    }
  }

  // Chân dung nhân vật phong cách Anime/Pixel Art chuẩn TaskBarHero
  renderHeroPortrait(charId) {
    if (!this.heroPortraitCanvas) return;

    if (charId === 'mage') {
      // Sorcerer: Mũ phù thuỷ rộng vành, tóc đen, mắt anime, áo choàng tím đen
      this.heroPortraitCanvas.innerHTML = `
        <svg viewBox="0 0 160 160" width="100%" height="100%" style="display:block; image-rendering: pixelated;">
          <defs>
            <radialGradient id="sorcererGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stop-color="#4c1d95" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="hatGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1e1b4b"/>
              <stop offset="100%" stop-color="#09090b"/>
            </linearGradient>
            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffedd5"/>
              <stop offset="100%" stop-color="#fed7aa"/>
            </linearGradient>
          </defs>
          <rect width="160" height="160" fill="url(#sorcererGlow)"/>
          
          <!-- Robe Body -->
          <path d="M 30 160 L 50 115 L 110 115 L 130 160 Z" fill="#18181b"/>
          <path d="M 62 118 L 80 135 L 98 118 Z" fill="#7c3aed" stroke="#fbbf24" stroke-width="2"/>
          <circle cx="80" cy="132" r="5" fill="#f59e0b" stroke="#fef08a" stroke-width="1.5"/>

          <!-- Anime Face -->
          <polygon points="56,82 104,82 96,118 80,128 64,118" fill="url(#skinGrad)"/>
          <!-- Hair Base -->
          <path d="M 50 82 Q 80 70 110 82 L 114 105 L 102 98 L 98 112 L 80 96 L 62 112 L 58 98 L 46 105 Z" fill="url(#hairGrad)"/>

          <!-- Eyes Anime -->
          <ellipse cx="68" cy="94" rx="5" ry="6" fill="#1e1b4b"/>
          <ellipse cx="69" cy="93" rx="3.5" ry="4.5" fill="#6366f1"/>
          <circle cx="68" cy="91" r="1.5" fill="#ffffff"/>
          
          <ellipse cx="92" cy="94" rx="5" ry="6" fill="#1e1b4b"/>
          <ellipse cx="93" cy="93" rx="3.5" ry="4.5" fill="#6366f1"/>
          <circle cx="92" cy="91" r="1.5" fill="#ffffff"/>

          <!-- Eyelashes & Brows -->
          <path d="M 62 88 Q 69 85 75 88" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M 85 88 Q 91 85 98 88" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>
          
          <!-- Cute Mouth & Blush -->
          <circle cx="63" cy="99" r="3" fill="#f43f5e" opacity="0.3"/>
          <circle cx="97" cy="99" r="3" fill="#f43f5e" opacity="0.3"/>
          <path d="M 78 108 Q 80 110 82 108" stroke="#c2410c" stroke-width="1.5" fill="none" stroke-linecap="round"/>

          <!-- Big Witch Hat (Signature TaskBarHero Sorcerer Hat) -->
          <!-- Hat Brim (Wide curve) -->
          <ellipse cx="80" cy="74" rx="72" ry="18" fill="url(#hatGrad)" stroke="#312e81" stroke-width="2"/>
          <ellipse cx="80" cy="75" rx="56" ry="12" fill="#0f172a"/>
          
          <!-- Hat Cone -->
          <path d="M 38 72 Q 74 38 78 12 Q 86 16 92 26 Q 106 50 122 72 Z" fill="url(#hatGrad)" stroke="#312e81" stroke-width="2"/>
          <!-- Hat Band -->
          <path d="M 46 68 Q 80 62 114 68 L 118 73 Q 80 67 42 73 Z" fill="#6b21a8" stroke="#fbbf24" stroke-width="1.5"/>
          <rect x="76" y="65" width="8" height="8" rx="2" fill="#f59e0b" stroke="#fef08a" stroke-width="1"/>

          <!-- Floating magical dust stars -->
          <polygon points="28,40 31,43 28,46 25,43" fill="#a855f7" opacity="0.8"/>
          <polygon points="135,50 138,53 135,56 132,53" fill="#38bdf8" opacity="0.8"/>
        </svg>
      `;
    } else if (charId === 'warrior') {
      // Knight: Mũ giáp thép bóng bẩy, lông vũ xanh, khiên giáp
      this.heroPortraitCanvas.innerHTML = `
        <svg viewBox="0 0 160 160" width="100%" height="100%" style="display:block; image-rendering: pixelated;">
          <defs>
            <radialGradient id="warriorGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="steelGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#94a3b8"/>
              <stop offset="50%" stop-color="#475569"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <linearGradient id="goldPlate" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fde047"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
          </defs>
          <rect width="160" height="160" fill="url(#warriorGlow)"/>

          <!-- Armor Shoulders -->
          <path d="M 20 160 L 48 118 L 112 118 L 140 160 Z" fill="url(#steelGrad)" stroke="#38bdf8" stroke-width="2"/>
          <polygon points="70,122 90,122 80,140" fill="url(#goldPlate)"/>

          <!-- Helmet Plume (Blue/Cyan Feather) -->
          <path d="M 80 45 C 80 15 110 8 125 15 C 115 32 95 38 85 45 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>

          <!-- Helmet Base -->
          <rect x="48" y="44" width="64" height="68" rx="16" fill="url(#steelGrad)" stroke="#cbd5e1" stroke-width="2"/>
          
          <!-- Visor / Face Slit -->
          <path d="M 52 74 L 108 74 L 104 88 L 80 94 L 56 88 Z" fill="#090d16" stroke="url(#goldPlate)" stroke-width="2"/>
          <!-- Glowing Eyes inside Visor -->
          <ellipse cx="68" cy="80" rx="6" ry="2.5" fill="#38bdf8"/>
          <ellipse cx="92" cy="80" rx="6" ry="2.5" fill="#38bdf8"/>

          <!-- Forehead Crest -->
          <polygon points="80,38 92,54 80,62 68,54" fill="url(#goldPlate)" stroke="#fef08a" stroke-width="1.5"/>
          <!-- Rivets -->
          <circle cx="56" cy="52" r="2.5" fill="#f8fafc"/>
          <circle cx="104" cy="52" r="2.5" fill="#f8fafc"/>
          <circle cx="58" cy="102" r="2.5" fill="#f8fafc"/>
          <circle cx="102" cy="102" r="2.5" fill="#f8fafc"/>
        </svg>
      `;
    } else {
      // Archer: Cung thủ rừng xanh, nón trùm ranger, mắt sắc lạnh
      this.heroPortraitCanvas.innerHTML = `
        <svg viewBox="0 0 160 160" width="100%" height="100%" style="display:block; image-rendering: pixelated;">
          <defs>
            <radialGradient id="archerGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stop-color="#15803d" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="hoodGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#166534"/>
              <stop offset="100%" stop-color="#052e16"/>
            </linearGradient>
            <linearGradient id="archerSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fde68a"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
          </defs>
          <rect width="160" height="160" fill="url(#archerGlow)"/>

          <!-- Body Cloak -->
          <path d="M 25 160 L 52 120 L 108 120 L 135 160 Z" fill="url(#hoodGrad)" stroke="#22c55e" stroke-width="2"/>
          <circle cx="80" cy="126" r="6" fill="#84cc16" stroke="#fef08a" stroke-width="1.5"/>

          <!-- Forest Hood Outer -->
          <path d="M 40 100 C 35 45 65 20 80 18 C 95 20 125 45 120 100 C 115 118 45 118 40 100 Z" fill="url(#hoodGrad)" stroke="#4ade80" stroke-width="2"/>
          
          <!-- Inner Shadow & Face -->
          <path d="M 52 90 C 50 60 68 50 80 50 C 92 50 110 60 108 90 C 104 104 56 104 52 90 Z" fill="#052e16"/>
          <polygon points="60,68 100,68 94,94 80,102 66,94" fill="url(#archerSkin)"/>
          
          <!-- Blonde/Brown Bangs -->
          <polygon points="58,68 76,75 80,68 84,75 102,68 92,62 68,62" fill="#ca8a04"/>

          <!-- Sharp Green Eyes -->
          <polygon points="64,78 74,80 73,84 63,82" fill="#22c55e"/>
          <circle cx="70" cy="81" r="1.5" fill="#ffffff"/>
          <polygon points="86,80 96,78 97,82 87,84" fill="#22c55e"/>
          <circle cx="90" cy="81" r="1.5" fill="#ffffff"/>

          <!-- Feather in Hood -->
          <polygon points="112,38 135,16 128,32 118,44" fill="#fbbf24" stroke="#fef08a" stroke-width="1"/>
        </svg>
      `;
    }
  }

  // ==================== RENDER INVENTORY GRID (28 SLOTS) ====================
  renderInventoryGrid() {
    if (!this.inventoryGrid) return;
    this.inventoryGrid.innerHTML = '';

    const inv = gameState.data.inventory || [];
    const filter = this.inventoryFilter;

    // Cập nhật chỉ số dung lượng
    if (this.invCapacityCounter) {
      this.invCapacityCounter.textContent = `${inv.length} / 28`;
      this.invCapacityCounter.classList.toggle('full', inv.length >= 28);
    }

    // 28 ô lưới cố định (7 cột x 4 hàng)
    for (let i = 0; i < 28; i++) {
      const slotDiv = document.createElement('div');
      slotDiv.dataset.index = i;

      const item = inv[i];
      if (item) {
        // Kiểm tra xem item có phù hợp với filter hiện tại không
        let matches = true;
        const slotDef = EQUIP_SLOTS[item.slot];
        const isGear = slotDef && slotDef.type === 'gear';
        const isAcc = slotDef && slotDef.type === 'accessory';

        if (filter === 'gear' && !isGear) matches = false;
        if (filter === 'accessory' && !isAcc) matches = false;

        slotDiv.className = `inv-slot-cell rarity-${item.rarity} ${matches ? '' : 'filtered-dim'}`;
        slotDiv.title = `${item.name} (Lv. ${item.level}) - ${RARITY_DEFS[item.rarity]?.name || ''}\nNhấp để xem chi tiết`;

        slotDiv.innerHTML = `
          <div class="inv-item-icon-wrap">
            <span class="inv-item-icon">${item.icon}</span>
          </div>
          <span class="inv-item-lvl">Lv.${item.level}</span>
          <div class="inv-item-rarity-bar"></div>
        `;

        slotDiv.addEventListener('click', () => {
          this.openItemDetail(item, {
            isEquipped: false,
            invIndex: i
          });
        });
      } else {
        // Ô trống: Weathered Dark Stone Inset Tile
        slotDiv.className = 'inv-slot-cell empty-cell';
        slotDiv.title = `Ô túi ${i + 1} (Trống)`;
      }

      this.inventoryGrid.appendChild(slotDiv);
    }
  }

  // ==================== RENDER SKILLS DOCK ====================
  renderSkillsDock() {
    const skills = gameState.currentSkillDefs;
    for (let i = 0; i < skills.length; i++) {
      const sk = skills[i];
      const key = sk.key;
      if (this.skillIcons[key]) this.skillIcons[key].textContent = sk.icon;
      if (this.skillNames[key]) this.skillNames[key].textContent = sk.name;
      if (this.skillButtons[key]) {
        this.skillButtons[key].title = `${sk.name}: ${sk.desc} [Phím ${i + 1}]`;
      }
    }
  }

  // ==================== RENDER STATUS PANEL ====================
  renderStatusPanel() {
    const cid = this.inspectCharId;
    const char = gameState.data.characters[cid];
    const meta = gameState.classMeta[cid];
    const upDefs = gameState.classUpgradeDefs[cid];

    if (this.statusHeroAvatar) this.statusHeroAvatar.textContent = meta.avatar;
    if (this.statusAvatarBox) this.statusAvatarBox.style.borderColor = meta.color;
    if (this.statusHeroName) {
      this.statusHeroName.textContent = meta.name;
      this.statusHeroName.style.color = meta.color;
    }
    if (this.statusHeroRole) this.statusHeroRole.textContent = meta.role;
    if (this.statusLevelBadge) this.statusLevelBadge.textContent = `Lv.${char.level}`;
    if (this.statusRoleSubtitle) this.statusRoleSubtitle.textContent = meta.title;

    if (this.statusHeroTitle) {
      const lvl = char.level;
      let title = `🌱 ${meta.name} Tập Sự`;
      if (lvl >= 20) title = `👑 Tối Thượng ${meta.name}`;
      else if (lvl >= 10) title = `⚔️ Bậc Thầy ${meta.name}`;
      else if (lvl >= 5) title = `🛡️ Thợ Săn ${meta.name}`;
      this.statusHeroTitle.textContent = title;
    }

    // Tính toán chỉ số của nhân vật đang inspect (gồm cả Upgrades + Trang Bị)
    const baseAtk = upDefs.weapon.calcValue(char.upgrades.weapon);
    const lvlBonus = (char.level - 1) * 2;
    const equipAtk = char.equipped ? Object.values(char.equipped).reduce((sum, it) => sum + (it?.stats?.atk || 0), 0) : 0;
    const totalDmg = baseAtk + lvlBonus + equipAtk;

    const baseHp = upDefs.armor.calcValue(char.upgrades.armor);
    const equipHp = char.equipped ? Object.values(char.equipped).reduce((sum, it) => sum + (it?.stats?.hp || 0), 0) : 0;
    const maxHp = baseHp + equipHp;

    const baseRegen = upDefs.regen.calcValue(char.upgrades.regen);
    const equipRegen = char.equipped ? Object.values(char.equipped).reduce((sum, it) => sum + (it?.stats?.regen || 0), 0) : 0;
    const regen = baseRegen + equipRegen;

    const baseSpd = upDefs.boots.calcValue(char.upgrades.boots);
    const equipSpd = char.equipped ? Object.values(char.equipped).reduce((sum, it) => sum + (it?.stats?.speed || 0), 0) : 0;
    const atkSpd = +(baseSpd + equipSpd).toFixed(2);

    const baseCrit = upDefs.accessory.calcValue(char.upgrades.accessory);
    const equipCrit = char.equipped ? Object.values(char.equipped).reduce((sum, it) => sum + (it?.stats?.crit || 0), 0) : 0;
    const crit = Math.min(85, Math.round(baseCrit + equipCrit));

    const goldM = upDefs.gold.calcValue(char.upgrades.gold);

    if (this.statValDamage) this.statValDamage.textContent = totalDmg;
    if (this.statDetailDamage) this.statDetailDamage.textContent = `(Cơ bản ${baseAtk} + Cấp ${lvlBonus} + Đồ ${equipAtk})`;
    if (this.statValHp) this.statValHp.textContent = maxHp;
    if (this.statValRegen) this.statValRegen.textContent = `+${regen} HP/s`;
    if (this.statValAttackSpeed) this.statValAttackSpeed.textContent = `${atkSpd} đòn/s`;
    if (this.statValCritChance) this.statValCritChance.textContent = `${crit}%`;
    if (this.statValCritMult) this.statValCritMult.textContent = cid === 'mage' ? '230%' : '200%';
    if (this.statValClickDamage) this.statValClickDamage.textContent = Math.max(5, Math.floor(totalDmg * 0.75));
    if (this.statValGoldMult) this.statValGoldMult.textContent = `x${goldM}`;

    if (this.statBuffFrenzy) {
      const isBuff = cid === gameState.activeCharId && gameState.isFrenzyActive;
      this.statBuffFrenzy.classList.toggle('hidden', !isBuff);
    }

    if (this.statRecordKills) this.statRecordKills.textContent = gameState.data.totalKills.toLocaleString('vi-VN');
    if (this.statRecordBosses) this.statRecordBosses.textContent = gameState.data.totalBossKills.toLocaleString('vi-VN');
    if (this.statRecordMaxStage) {
      this.statRecordMaxStage.textContent = `Ải ${gameState.data.maxUnlockedStage}-${gameState.data.maxUnlockedSubStage}`;
    }
  }

  // ==================== RENDER UPGRADES MODAL ====================
  renderUpgrades() {
    if (!this.upgradesContainer) return;
    this.upgradesContainer.innerHTML = '';

    const activeMeta = gameState.activeCharMeta;
    if (this.modalUpgradesTitle) {
      this.modalUpgradesTitle.textContent = `NÂNG CẤP CHỈ SỐ: ${activeMeta.name.toUpperCase()}`;
    }

    const upDefs = gameState.currentUpgradeDefs;
    const char = gameState.activeChar;

    for (const key of Object.keys(upDefs)) {
      const def = upDefs[key];
      const lvl = char.upgrades[key];
      const cost = gameState.getUpgradeCost(key);
      const canAfford = gameState.data.gold >= cost;
      const currentVal = def.calcValue(lvl);
      const nextVal = def.calcValue(lvl + 1);

      const card = document.createElement('div');
      card.className = `upgrade-card ${canAfford ? 'affordable' : 'locked'}`;

      card.innerHTML = `
        <div class="card-icon">${def.icon}</div>
        <div class="card-info">
          <div class="card-title">
            <span class="card-name">${def.name}</span>
            <span class="card-level">Cấp ${lvl}</span>
          </div>
          <div class="card-desc">${def.desc}</div>
          <div class="card-stat">${currentVal} ➔ <span class="next-val">${nextVal}</span></div>
        </div>
        <button class="btn-buy" ${canAfford ? '' : 'disabled'}>
          <span class="coin-icon">💰</span> ${cost.toLocaleString('vi-VN')}
        </button>
      `;

      const buyBtn = card.querySelector('.btn-buy');
      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (gameState.buyUpgrade(key)) {
          sounds.playCoin();
        }
      });

      this.upgradesContainer.appendChild(card);
    }
  }

  // ==================== RENDER MAP PANEL ====================
  renderMapPanel() {
    const curStage = gameState.data.stage;
    const curSubStage = gameState.data.subStage;
    const maxUnlockedStage = gameState.data.maxUnlockedStage;
    const worldInfo = gameState.getWorld(this.viewWorld);

    if (this.mapWorldTitle) {
      this.mapWorldTitle.textContent = `TG ${worldInfo.id}: ${worldInfo.name}`;
    }

    if (this.mapStagesTitle) {
      this.mapStagesTitle.textContent = `DANH SÁCH ẢI (${this.viewWorld}-1 ➔ ${this.viewWorld}-10)`;
    }

    if (this.mapProgressCount) {
      if (this.viewWorld === curStage) {
        this.mapProgressCount.textContent = `Ải ${curStage}-${curSubStage} (Wave ${gameState.data.currentWave || 1}/10)`;
      } else {
        this.mapProgressCount.textContent = `Xem TG ${this.viewWorld}`;
      }
    }

    if (this.btnPrevWorld) {
      this.btnPrevWorld.disabled = this.viewWorld <= 1;
    }
    if (this.btnNextWorld) {
      this.btnNextWorld.disabled = this.viewWorld >= maxUnlockedStage;
    }

    if (this.btnReturnCurrent) {
      const isViewingDifferentWorld = this.viewWorld !== curStage;
      this.btnReturnCurrent.classList.toggle('hidden', !isViewingDifferentWorld);
      if (isViewingDifferentWorld) {
        this.btnReturnCurrent.textContent = `📍 Quay về Ải đang đánh (${curStage}-${curSubStage})`;
      }
    }

    if (this.btnToggleAutoAdvance) {
      const isAuto = gameState.data.autoAdvanceStage !== false;
      this.btnToggleAutoAdvance.classList.toggle('active', isAuto);
      this.btnToggleAutoAdvance.classList.toggle('mode-repeat', !isAuto);
      this.btnToggleAutoAdvance.innerHTML = `
        <span class="auto-mode-icon">${isAuto ? '⏩' : '🔁'}</span>
        <span class="auto-mode-text">Chế độ: ${isAuto ? 'Tự Động Qua Ải (BẬT)' : 'Treo Máy Cố Định (Lặp lại)'}</span>
      `;
    }

    if (this.bossAlertBox) {
      const isFarming = gameState.data.isFarmingAfterBossLoss && (this.viewWorld === curStage);
      this.bossAlertBox.classList.toggle('hidden', !isFarming);
      if (this.chkAutoBoss) {
        this.chkAutoBoss.checked = gameState.data.autoChallengeBoss;
      }
    }

    if (!this.mapStagesList) return;

    // Chỉ xây lại 10 thẻ khi đổi Thế Giới để mượt mà
    const needRebuild = (this.renderedWorld !== this.viewWorld) || (this.mapStagesList.children.length !== 10);

    if (needRebuild) {
      this.mapStagesList.innerHTML = '';
      this.renderedWorld = this.viewWorld;

      for (let sub = 1; sub <= 10; sub++) {
        const isBoss = sub === 10;
        const item = document.createElement('div');
        item.dataset.sub = sub;

        let icon = isBoss ? '👑' : '⚔️';
        let title = isBoss ? `Ải ${this.viewWorld}-${sub}: TRÙM THẾ GIỚI` : `Ải ${this.viewWorld}-${sub} (10 Wave)`;
        let desc = isBoss ? worldInfo.bossName : `Wave 1-9 Quái • Wave 10 Boss Ải`;

        item.innerHTML = `
          <div class="stage-left">
            <span class="stage-icon">${icon}</span>
            <div class="stage-info">
              <span class="stage-name">${title}</span>
              <span class="stage-sub">${desc}</span>
            </div>
          </div>
          <div class="stage-right"></div>
        `;

        item.addEventListener('click', () => {
          const isUnlockedNow = gameState.isStageUnlocked(this.viewWorld, sub);
          const isCurrentNow = (gameState.data.stage === this.viewWorld && gameState.data.subStage === sub);
          if (isUnlockedNow && !isCurrentNow) {
            if (gameState.setStage(this.viewWorld, sub)) {
              sounds.playCoin();
              window.dispatchEvent(new CustomEvent('stage-selected'));
            }
          }
        });

        this.mapStagesList.appendChild(item);
      }
    }

    // Cập nhật trạng thái (active, cleared, locked)
    for (let sub = 1; sub <= 10; sub++) {
      const item = this.mapStagesList.children[sub - 1];
      if (!item) continue;

      const isBoss = sub === 10;
      const isCurrent = (this.viewWorld === curStage && curSubStage === sub);
      const isUnlocked = gameState.isStageUnlocked(this.viewWorld, sub);
      const isCleared = !isCurrent && isUnlocked && (
        this.viewWorld < gameState.data.maxUnlockedStage ||
        (this.viewWorld === gameState.data.maxUnlockedStage && sub < gameState.data.maxUnlockedSubStage)
      );

      item.className = `map-stage-item ${isBoss ? 'boss-stage' : ''} ${isCurrent ? 'active' : ''} ${isCleared ? 'cleared' : ''} ${!isUnlocked ? 'locked' : ''}`;

      let statusBadge = '';
      if (isCurrent) {
        statusBadge = `<span class="badge-status active">⚔️ ĐANG ĐÁNH</span>`;
      } else if (isCleared) {
        statusBadge = `<span class="badge-status cleared">✓ ĐÃ QUA</span>`;
      } else if (isUnlocked) {
        statusBadge = `<span class="badge-status unlocked">SẴN SÀNG</span>`;
      } else {
        statusBadge = `<span class="badge-status locked">🔒 KHÓA</span>`;
      }

      const rightEl = item.querySelector('.stage-right');
      if (rightEl && rightEl.innerHTML !== statusBadge) {
        rightEl.innerHTML = statusBadge;
      }

      if (isUnlocked && !isCurrent) {
        item.style.cursor = 'pointer';
        item.title = `Nhấp để chuyển đến Ải ${this.viewWorld}-${sub}`;
      } else {
        item.style.cursor = isCurrent ? 'default' : 'not-allowed';
        item.title = isCurrent ? 'Đang chiến đấu tại ải này' : 'Ải này chưa mở khoá';
      }
    }
  }

  updateSkillCooldowns() {
    for (const sk of ['skill1', 'skill2', 'skill3']) {
      const btn = this.skillButtons[sk];
      if (!btn) continue;

      const progress = gameState.getSkillCooldownProgress(sk);
      const cdFill = btn.querySelector('.skill-cd-fill');
      const isReady = progress === 0;

      btn.classList.toggle('ready', isReady);
      btn.classList.toggle('on-cooldown', !isReady);

      if (sk === 'skill1') {
        btn.classList.toggle('active-buff', gameState.isFrenzyActive);
      }

      if (cdFill) {
        cdFill.style.height = `${progress * 100}%`;
      }
    }

    // Hex skills cd sync
    if (this.heroHexSkills.skill1 && this.heroHexCds.skill1) {
      const p1 = gameState.getSkillCooldownProgress('skill1');
      this.heroHexSkills.skill1.classList.toggle('ready', p1 === 0);
      this.heroHexCds.skill1.style.height = `${p1 * 100}%`;
    }
    if (this.heroHexSkills.skill2 && this.heroHexCds.skill2) {
      const p2 = gameState.getSkillCooldownProgress('skill2');
      this.heroHexSkills.skill2.classList.toggle('ready', p2 === 0);
      this.heroHexCds.skill2.style.height = `${p2 * 100}%`;
    }
  }
}
