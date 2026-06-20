"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnKillEffect = exports.GrowGroundEffect = exports.PeriodicEffect = exports.OnItemRemovedEffect = exports.OnItemGainedEffect = exports.Effect = void 0;
const Item_1 = require("../types/enum/Item");
const Synergy_1 = require("../types/enum/Synergy");
class Effect {
    constructor(effect, origin) {
        this.apply = effect;
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
class PeriodicEffect extends Effect {
    constructor(effect, intervalMs, origin) {
        super(effect, origin);
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
        const synergyLevel = Synergy_1.SynergyEffects[Synergy_1.Synergy.GROUND].indexOf(effect) + 1;
        super((pokemon) => {
            pokemon.addDefense(synergyLevel, pokemon, 0, false);
            pokemon.addSpecialDefense(synergyLevel, pokemon, 0, false);
            pokemon.addAttack(synergyLevel, pokemon, 0, false);
            pokemon.transferAbility("GROUND_GROW");
            if (pokemon.items.has(Item_1.Item.BIG_NUGGET) &&
                this.count === 5 &&
                pokemon.player) {
                pokemon.player.addMoney(3, true, pokemon);
                pokemon.count.moneyCount += 3;
            }
        }, 3000, effect);
    }
}
exports.GrowGroundEffect = GrowGroundEffect;
class OnKillEffect extends Effect {
    constructor(effect) {
        super(effect);
        this.apply = effect;
    }
}
exports.OnKillEffect = OnKillEffect;
//# sourceMappingURL=effect.js.map