"use strict";

// PBZModLoader CommonJS entry. Runs after MainStart and before the first save menu.
// Only the save-menu capacity helper is changed; the game's real count and writer stay intact.
const LIMIT = 500;
const PATCH_MARKER = "__PBZManualSave500";
exports.ready = false;

const gameModule = require("UI/Widget/SaveGame");
const prototype = gameModule && gameModule.SaveGameInterface && gameModule.SaveGameInterface.prototype;
if (!prototype || typeof prototype.getManualSaveSlotCap !== "function") {
    throw new Error("[PBZManualSave500] Unsupported game: SaveGameInterface.getManualSaveSlotCap is unavailable.");
}

const original = prototype.getManualSaveSlotCap;
if (original[PATCH_MARKER] === true) {
    exports.ready = true;
    exports.stop = function () {};
} else {
    const source = Function.prototype.toString.call(original);
    if (!source.includes("SHIPPING_MANUAL_SAVE_SLOT_CAP") || !source.includes("IsShipping")) {
        throw new Error("[PBZManualSave500] Capacity helper changed or another mod owns it. No patch applied.");
    }

    function manualSaveSlotCap500() {
        return LIMIT;
    }
    Object.defineProperty(manualSaveSlotCap500, PATCH_MARKER, { value: true });
    prototype.getManualSaveSlotCap = manualSaveSlotCap500;

    exports.stop = function () {
        // Do not undo a later mod's change. Restart the game after removal or loader changes.
        if (prototype.getManualSaveSlotCap === manualSaveSlotCap500) {
            prototype.getManualSaveSlotCap = original;
        }
        exports.ready = false;
    };
    exports.ready = true;
    exports.limit = LIMIT;
    console.log("[PBZMOD][PBZManualSave500] Save-menu cap = 500. Restart required after install/removal.");
}
