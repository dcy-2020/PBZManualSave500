import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../ProjectPBZ/PBZModLoader/mods/PBZManualSave500/main.js', import.meta.url), 'utf8');

function gameFixture() {
  // A small independent interface fixture, without any extracted game code.
  const SHIPPING_MANUAL_SAVE_SLOT_CAP = 20;
  const UE = { PBZBlueprintFunctionLibrary: { IsShipping: () => true } };
  class SaveGameInterface {
    getManualSaveSlotCap() {
      return UE.PBZBlueprintFunctionLibrary.IsShipping() ? SHIPPING_MANUAL_SAVE_SLOT_CAP : 99;
    }
    getManualSaveFilesCount() { return 27; }
  }
  return { SaveGameInterface };
}

function load(game) {
  const exports = {};
  const context = vm.createContext({
    exports,
    console: { log() {} },
    require(name) {
      assert.equal(name, 'UI/Widget/SaveGame');
      return game;
    },
  });
  new vm.Script(source, { filename: 'PBZManualSave500/main.js' }).runInContext(context);
  return exports;
}

test('changes capacity without replacing the real count method', () => {
  const game = gameFixture();
  const counter = game.SaveGameInterface.prototype.getManualSaveFilesCount;
  const mod = load(game);
  const widget = new game.SaveGameInterface();
  assert.equal(mod.ready, true);
  assert.equal(widget.getManualSaveSlotCap(), 500);
  assert.equal(widget.getManualSaveFilesCount(), 27);
  assert.equal(game.SaveGameInterface.prototype.getManualSaveFilesCount, counter);
});

test('stop restores the exact original function', () => {
  const game = gameFixture();
  const original = game.SaveGameInterface.prototype.getManualSaveSlotCap;
  const mod = load(game);
  mod.stop();
  assert.equal(mod.ready, false);
  assert.equal(game.SaveGameInterface.prototype.getManualSaveSlotCap, original);
});

test('stop preserves a later mod replacement', () => {
  const game = gameFixture();
  const mod = load(game);
  const other = () => 300;
  game.SaveGameInterface.prototype.getManualSaveSlotCap = other;
  mod.stop();
  assert.equal(game.SaveGameInterface.prototype.getManualSaveSlotCap, other);
});

test('an unsupported helper is rejected before mutation', () => {
  const game = gameFixture();
  const other = () => 25;
  game.SaveGameInterface.prototype.getManualSaveSlotCap = other;
  assert.throws(() => load(game), /Capacity helper changed/);
  assert.equal(game.SaveGameInterface.prototype.getManualSaveSlotCap, other);
});

test('missing interfaces fail with a useful error', () => {
  assert.throws(() => load({}), /Unsupported game/);
});

test('a second copy leaves ownership with the first copy', () => {
  const game = gameFixture();
  const original = game.SaveGameInterface.prototype.getManualSaveSlotCap;
  const owner = load(game);
  const installed = game.SaveGameInterface.prototype.getManualSaveSlotCap;
  const duplicate = load(game);
  assert.equal(duplicate.ready, true);
  duplicate.stop();
  assert.equal(game.SaveGameInterface.prototype.getManualSaveSlotCap, installed);
  owner.stop();
  assert.equal(game.SaveGameInterface.prototype.getManualSaveSlotCap, original);
});
