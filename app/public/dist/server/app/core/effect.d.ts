import Board from "./board";
import { PokemonEntity } from "./pokemon-entity";
import { Item } from "../types/enum/Item";
import { Effect as EffectEnum } from "../types/enum/Effect";
type EffectOrigin = EffectEnum | Item;
export declare abstract class Effect {
    origin?: EffectOrigin;
    apply: (entity: PokemonEntity, ...others: any[]) => void;
    constructor(effect: (entity: PokemonEntity, ...others: any[]) => void, origin?: EffectOrigin);
}
export declare class OnItemGainedEffect extends Effect {
}
export declare class OnItemRemovedEffect extends Effect {
}
export declare class PeriodicEffect extends Effect {
    intervalMs: number;
    timer: number;
    count: number;
    constructor(effect: (entity: PokemonEntity) => void, intervalMs: number, origin?: EffectOrigin);
    update(dt: number, entity: PokemonEntity): void;
}
export declare class GrowGroundEffect extends PeriodicEffect {
    constructor(effect: EffectEnum);
}
export declare class OnKillEffect extends Effect {
    apply: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void;
    constructor(effect: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void);
}
export {};
