"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterSpringEffect = exports.SoundCryEffect = exports.OnAbilityCastEffect = exports.FireHitEffect = exports.OnAttackEffect = exports.OnHitEffect = exports.GrowGroundEffect = exports.PeriodicEffect = exports.MonsterKillEffect = exports.OnKillEffect = exports.OnItemRemovedEffect = exports.OnItemGainedEffect = exports.Effect = void 0;
const Item_1 = require("../types/enum/Item");
const Synergy_1 = require("../types/enum/Synergy");
const Passive_1 = require("../types/enum/Passive");
const Ability_1 = require("../types/enum/Ability");
class Effect {
    apply(entity, ...others) { }
    constructor(effect, origin) {
        if (effect) {
            this.apply = effect;
        }
        this.origin = origin;
    }
}
exports.Effect = Effect;
class OnItemGainedEffect extends Effect {
}
exports.OnItemGainedEffect = OnItemGainedEffect;
class OnItemRemovedEffect extends Effect {
}
exports.OnItemRemovedEffect = OnItemRemovedEffect;
class OnKillEffect extends Effect {
    apply(entity, target, board) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnKillEffect = OnKillEffect;
class MonsterKillEffect extends OnKillEffect {
    constructor(effect) {
        super(undefined, effect);
        this.hpBoosted = 0;
        this.count = 0;
        this.synergyLevel = Synergy_1.SynergyEffects[Synergy_1.Synergy.MONSTER].indexOf(effect);
    }
    apply(pokemon, target, board) {
        var _a, _b, _c;
        const attackBoost = (_a = [3, 6, 10, 10][this.synergyLevel]) !== null && _a !== void 0 ? _a : 10;
        const apBoost = (_b = [10, 20, 30, 30][this.synergyLevel]) !== null && _b !== void 0 ? _b : 30;
        const hpGain = (_c = [0.2, 0.4, 0.6, 0.6][this.synergyLevel]) !== null && _c !== void 0 ? _c : 0.6;
        const lifeBoost = hpGain * target.hp;
        pokemon.addAttack(attackBoost, pokemon, 0, false);
        pokemon.addAbilityPower(apBoost, pokemon, 0, false);
        pokemon.addMaxHP(lifeBoost, pokemon, 0, false);
        this.hpBoosted += lifeBoost;
        this.count += 1;
    }
}
exports.MonsterKillEffect = MonsterKillEffect;
class PeriodicEffect extends Effect {
    constructor(intervalMs, origin) {
        super(undefined, origin);
        this.intervalMs = intervalMs;
        this.timer = intervalMs;
        this.count = 0;
    }
    update(dt, entity) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.count++;
            this.apply(entity);
            this.timer = this.intervalMs;
        }
    }
}
exports.PeriodicEffect = PeriodicEffect;
class GrowGroundEffect extends PeriodicEffect {
    constructor(effect) {
        super(3000, effect);
        this.synergyLevel = Synergy_1.SynergyEffects[Synergy_1.Synergy.GROUND].indexOf(effect) + 1;
    }
    apply(pokemon) {
        if (this.count > 5) {
            return;
        }
        pokemon.addDefense(this.synergyLevel, pokemon, 0, false);
        pokemon.addSpecialDefense(this.synergyLevel, pokemon, 0, false);
        pokemon.addAttack(this.synergyLevel, pokemon, 0, false);
        pokemon.transferAbility("GROUND_GROW");
        if (pokemon.items.has(Item_1.Item.BIG_NUGGET) &&
            this.count === 5 &&
            pokemon.player) {
            pokemon.player.addMoney(3, true, pokemon);
            pokemon.count.moneyCount += 3;
        }
    }
}
exports.GrowGroundEffect = GrowGroundEffect;
class OnHitEffect extends Effect {
    apply(entity, target, board) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnHitEffect = OnHitEffect;
class OnAttackEffect extends Effect {
    apply(entity, target, board) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnAttackEffect = OnAttackEffect;
class FireHitEffect extends OnAttackEffect {
    constructor(effect) {
        super(undefined, effect);
        this.count = 0;
        this.synergyLevel = Synergy_1.SynergyEffects[Synergy_1.Synergy.FIRE].indexOf(effect);
    }
    apply(pokemon, target, board) {
        pokemon.addAttack(this.synergyLevel, pokemon, 0, false);
        this.count += 1;
    }
}
exports.FireHitEffect = FireHitEffect;
class OnAbilityCastEffect extends Effect {
    apply(pokemon, state, board, target, crit) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnAbilityCastEffect = OnAbilityCastEffect;
class SoundCryEffect extends OnAbilityCastEffect {
    constructor(effect) {
        super(undefined, effect);
        this.count = 0;
        this.synergyLevel = -1;
        if (effect) {
            this.synergyLevel = Synergy_1.SynergyEffects[Synergy_1.Synergy.SOUND].indexOf(effect);
        }
    }
    apply(pokemon, state, board, target, crit) {
        var _a, _b, _c;
        pokemon.transferAbility(Ability_1.Ability.ECHO);
        const attackBoost = (_a = [2, 1, 1][this.synergyLevel]) !== null && _a !== void 0 ? _a : 0;
        const attackSpeedBoost = (_b = [0, 5, 5][this.synergyLevel]) !== null && _b !== void 0 ? _b : 0;
        const manaBoost = (_c = [0, 0, 3][this.synergyLevel]) !== null && _c !== void 0 ? _c : 0;
        const chimecho = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .some((cell) => { var _a; return ((_a = cell.value) === null || _a === void 0 ? void 0 : _a.passive) === Passive_1.Passive.CHIMECHO; });
        const scale = (chimecho ? 2 : 1) *
            (pokemon.passive === Passive_1.Passive.MEGA_LAUNCHER ? 3 : 1);
        board.cells.forEach((ally) => {
            if ((ally === null || ally === void 0 ? void 0 : ally.team) === pokemon.team) {
                ally.status.sleep = false;
                ally.addAttack(attackBoost * scale, pokemon, 0, false);
                ally.addAttackSpeed(attackSpeedBoost * scale, pokemon, 0, false);
                ally.addPP(manaBoost * scale, pokemon, 0, false);
                ally.count.soundCryCount += scale;
            }
        });
    }
}
exports.SoundCryEffect = SoundCryEffect;
class WaterSpringEffect extends OnAbilityCastEffect {
    apply(pokemon) {
        pokemon.simulation.board.forEach((x, y, pkm) => {
            if ((pkm === null || pkm === void 0 ? void 0 : pkm.passive) === Passive_1.Passive.WATER_SPRING &&
                pkm.team !== pokemon.team) {
                pkm.addPP(5, pkm, 0, false);
                pkm.transferAbility(pkm.skill);
            }
        });
    }
}
exports.WaterSpringEffect = WaterSpringEffect;
//# sourceMappingURL=effect.js.map