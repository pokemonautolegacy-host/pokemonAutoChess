"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("../types/enum/Item");
const random_1 = require("../utils/random");
class ItemFactory {
    static createWonderboxItems(existingItems) {
        const wonderboxItems = [];
        for (let n = 0; n < 2; n++) {
            const elligibleItems = Item_1.CraftableItems.filter((i) => !Item_1.SynergyStones.includes(i) &&
                !wonderboxItems.includes(i) &&
                !existingItems.has(i) &&
                i !== Item_1.Item.WONDER_BOX);
            wonderboxItems.push((0, random_1.pickRandomIn)(elligibleItems));
        }
        return wonderboxItems;
    }
}
exports.default = ItemFactory;
//# sourceMappingURL=item-factory.js.map