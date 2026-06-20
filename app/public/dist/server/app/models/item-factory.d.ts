import { SetSchema } from "@colyseus/schema";
import { Item } from "../types/enum/Item";
export default class ItemFactory {
    static createWonderboxItems(existingItems: SetSchema<Item>): Item[];
}
