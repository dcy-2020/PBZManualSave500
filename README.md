> **重要提示：涉及存档操作，请妥善备份好存档。**
>
> **IMPORTANT: This mod affects saves. Back up your save files before use.**

# 500 Manual Save Slots

[中文说明](README.zh-CN.md)

[Nexus Mods](https://www.nexusmods.com/phantombladezero/mods/1080) · [GitHub releases](https://github.com/dcy-2020/PBZManualSave500/releases)

Keep more milestones in **Phantom Blade Zero**: raise the normal manual save limit from **20 to 500** and keep using the game's usual save and load menus.

- The save counter shows `/500`, and you can create new manual saves beyond the original 20-slot limit.
- Runs automatically with PBZModLoader whenever you start the game.
- Small JavaScript mod; no separate launcher, Node.js or Python required to play.
- In-game testing: **27 manual saves working normally**, reported on 12 November 2026.

## Install

1. Close the game and back up your entire save folder. On Steam, look in `<game folder>/ProjectPBZ/Saved/SaveGames/Steam/<account folder>/`.
2. Install [PBZModLoader](https://github.com/zoneoflkf/PBZModLoader) using its installation guide. The loader is a separate requirement.
3. Download `PBZ-Manual-Save-500-v1.0.0.zip` from [GitHub Releases](https://github.com/dcy-2020/PBZManualSave500/releases) or the [Nexus Mods Files tab](https://www.nexusmods.com/phantombladezero/mods/1080?tab=files) and extract it into the game folder containing `ProjectPBZ`.
4. Check this path, then start the game normally:

```text
<game folder>/ProjectPBZ/PBZModLoader/mods/PBZManualSave500/main.js
```

Open the normal manual save menu at a bell. Its counter should show `/500`.

## How it works

The mod changes `SaveGameInterface.prototype.getManualSaveSlotCap()` to return `500` before the first save menu opens. The game continues to count, name, write and load its own saves. The full-slots message still applies when the count reaches 500.

This is a manual save expansion. Automatic saves and Nightmare run slots keep their existing game behaviour.

## Remove or update

Close the game, then remove or replace only the `PBZManualSave500` folder under `ProjectPBZ/PBZModLoader/mods/`. Restart the game after installation, removal or updates; this mod is intended for startup loading.

Removing the mod does not delete save files. Back up before removing it, especially when you already have more than 20 manual saves.

## Compatibility and help

Designed for the Steam PC version and PBZModLoader. If a game update or another mod changes the same capacity helper, the compatibility check can stop this mod from applying. Look for `PBZManualSave500` in the loader log; see the loader's guide for its location.

Install one copy of this mod. If a custom `mods.ini` disables it, enable the `PBZManualSave500` mod ID according to the loader's guide. Report issues in the Posts tab on this mod's Nexus Mods page, with your game build and loader version. Please keep personal save files and account information out of public reports.

## Credits and source

By [dcy2020](https://www.nexusmods.com/profile/dcy2020). Code and documentation developed with generative AI; tested in game by the author. The included `main.js` is the full mod source, provided under the [MIT License](LICENSE).

Requires [PBZModLoader](https://github.com/zoneoflkf/PBZModLoader), created by LKF. The loader is distributed separately under its own license. See [THIRD_PARTY.md](THIRD_PARTY.md).
