import { IPokemon, IPokemonEntity } from "../../../../types";
import { Orientation } from "../../../../types/enum/Game";
export declare const FIREBASE_CONFIG: {
    apiKey: string | undefined;
    authDomain: string | undefined;
    projectId: string | undefined;
    storageBucket: string | undefined;
    messagingSenderId: string | undefined;
    appId: string | undefined;
};
export declare function transformCoordinate(x: number, y: number): number[];
export declare function transformAttackCoordinate(x: number, y: number, flip: boolean): number[];
export declare function transformMiniGameXCoordinate(x: number): number;
export declare function transformMiniGameYCoordinate(y: number): number;
export declare function getOrientation(x1: number, y1: number, x2: number, y2: number): Orientation;
export declare function getPortraitPath(pokemon: IPokemonEntity | IPokemon): string;
