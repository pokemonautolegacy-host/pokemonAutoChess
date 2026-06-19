import Board from "./board";
import { PokemonEntity } from "./pokemon-entity";
import { Item } from "../types/enum/Item";
import { Effect as EffectEnum } from "../types/enum/Effect";
import PokemonState from "./pokemon-state";
type EffectOrigin = EffectEnum | Item;
export declare abstract class Effect {
    origin?: EffectOrigin;
    apply(entity: PokemonEntity, ...others: any[]): void;
    constructor(effect?: (entity: PokemonEntity, ...others: any[]) => void, origin?: EffectOrigin);
}
export declare class OnItemGainedEffect extends Effect {
}
export declare class OnItemRemovedEffect extends Effect {
}
export declare class OnKillEffect extends Effect {
    apply(entity: PokemonEntity, target: PokemonEntity, board: Board): void;
    constructor(effect?: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void, origin?: EffectOrigin);
}
export declare class MonsterKillEffect extends OnKillEffect {
    hpBoosted: number;
    count: number;
    synergyLevel: number;
    constructor(effect: EffectEnum);
    apply(pokemon: any, target: any, board: any): void;
}
export declare abstract class PeriodicEffect extends Effect {
    intervalMs: number;
    timer: number;
    count: number;
    constructor(intervalMs: number, origin?: EffectOrigin);
    update(dt: number, entity: PokemonEntity): void;
}
export declare class GrowGroundEffect extends PeriodicEffect {
    synergyLevel: number;
    constructor(effect: EffectEnum);
    apply(pokemon: any): void;
}
export declare class OnHitEffect extends Effect {
    apply(entity: PokemonEntity, target: PokemonEntity, board: Board): void;
    constructor(effect?: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void, origin?: EffectOrigin);
}
export declare class OnAttackEffect extends Effect {
    apply(entity: PokemonEntity, target: PokemonEntity, board: Board): void;
    constructor(effect?: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void, origin?: EffectOrigin);
}
export declare class FireHitEffect extends OnAttackEffect {
    count: number;
    synergyLevel: number;
    constructor(effect: EffectEnum);
    apply(pokemon: any, target: any, board: any): void;
}
export declare class OnAbilityCastEffect extends Effect {
    apply(pokemon: PokemonEntity, state: PokemonState, board: Board, target: PokemonEntity, crit: boolean): void;
    constructor(effect?: (pokemon: PokemonEntity, state: PokemonState, board: Board, target: PokemonEntity, crit: boolean) => void, origin?: EffectOrigin);
}
export declare class SoundCryEffect extends OnAbilityCastEffect {
    count: number;
    synergyLevel: number;
    constructor(effect?: EffectEnum);
    apply(pokemon: any, state: any, board: any, target: any, crit: any): void;
}
export declare class WaterSpringEffect extends OnAbilityCastEffect {
    apply(pokemon: any): void;
}
export {};
