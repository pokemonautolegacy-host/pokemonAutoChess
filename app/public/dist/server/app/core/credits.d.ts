import { ICreditName } from "../types";
export interface PokemonCredits {
    portrait_credit: Credit;
    sprite_credit: Credit;
}
export interface Credit {
    primary: string;
    secondary: string[];
    total: number;
}
export declare function useCredits(): {
    loading: boolean;
    creditsNames: ICreditName[];
    spriteCredits: Record<string, PokemonCredits>;
};
