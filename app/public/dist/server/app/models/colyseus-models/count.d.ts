import { Schema } from "@colyseus/schema";
import { ICount } from "../../types";
export default class Count extends Schema implements ICount {
    crit: number;
    ult: number;
    fieldCount: number;
    soundCount: number;
    fairyCritCount: number;
    attackCount: number;
    fightingBlockCount: number;
    dodgeCount: number;
    powerLensCount: number;
    starDustCount: number;
    tripleAttackCount: number;
    staticHolderCount: number;
    defensiveRibbonCount: number;
    spellBlockedCount: number;
    manaBurnCount: number;
    moneyCount: number;
    amuletCoinCount: number;
    bottleCapCount: number;
    upgradeCount: number;
    soulDewCount: number;
    magmarizerCount: number;
}
