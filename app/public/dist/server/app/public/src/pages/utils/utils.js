"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIREBASE_CONFIG = void 0;
exports.transformCoordinate = transformCoordinate;
exports.transformAttackCoordinate = transformAttackCoordinate;
exports.transformMiniGameXCoordinate = transformMiniGameXCoordinate;
exports.transformMiniGameYCoordinate = transformMiniGameYCoordinate;
exports.getOrientation = getOrientation;
exports.getPortraitPath = getPortraitPath;
const Game_1 = require("../../../../types/enum/Game");
exports.FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
function transformCoordinate(x, y) {
    if (y === 0) {
        return [28 * 24 + 96 * x, 808];
    }
    else {
        return [28 * 24 + 96 * x, 760 - 96 * y];
    }
}
function transformAttackCoordinate(x, y, flip) {
    return [28 * 24 + 96 * x, flip ? 184 + 96 * y : 664 - 96 * y];
}
function transformMiniGameXCoordinate(x) {
    return 28 * 24 + x;
}
function transformMiniGameYCoordinate(y) {
    return 664 - y;
}
function getOrientation(x1, y1, x2, y2) {
    let angle = Math.atan2(y2 - y1, x2 - x1);
    if (angle < 0) {
        angle += 2 * Math.PI;
    }
    const quarterPi = Math.PI / 4;
    if (angle < quarterPi) {
        return Game_1.Orientation.RIGHT;
    }
    else if (angle < 2 * quarterPi) {
        return Game_1.Orientation.DOWNRIGHT;
    }
    else if (angle < 3 * quarterPi) {
        return Game_1.Orientation.DOWN;
    }
    else if (angle < 4 * quarterPi) {
        return Game_1.Orientation.DOWNLEFT;
    }
    else if (angle < 5 * quarterPi) {
        return Game_1.Orientation.LEFT;
    }
    else if (angle < 6 * quarterPi) {
        return Game_1.Orientation.UPLEFT;
    }
    else if (angle < 7 * quarterPi) {
        return Game_1.Orientation.UP;
    }
    else if (angle < 8 * quarterPi) {
        return Game_1.Orientation.UPRIGHT;
    }
    else {
        return Game_1.Orientation.RIGHT;
    }
}
function getPortraitPath(pokemon) {
    let pokemonPath = "";
    const index = pokemon.index;
    pokemonPath += index + "/";
    if (pokemon.shiny) {
        const shinyPad = pokemon.index.length == 4 ? `0000/0001/` : `0001/`;
        pokemonPath += shinyPad;
    }
    pokemonPath += pokemon.emotion;
    return pokemonPath;
}
//# sourceMappingURL=utils.js.map