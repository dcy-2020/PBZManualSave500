> **重要提示：涉及存档操作，请妥善备份好存档。**

# 500 个手动存档位

[N 网发布页](https://www.nexusmods.com/phantombladezero/mods/1080) · [GitHub 下载页](https://github.com/dcy-2020/PBZManualSave500/releases)

把《影之刃零》普通手动存档上限从 **20 提升到 500**，保留更多进度节点，继续使用游戏原有的存档、读档界面。

- 存档计数显示 `/500`，超过 20 个后仍可新建手动档。
- 随 PBZModLoader 自动加载，以后正常启动游戏即可。
- 轻量 JavaScript Mod，玩家无需另开脚本，也无需安装 Node.js 或 Python。
- **已在游戏内实测 27 个手动存档，正常使用。**测试反馈日期：2026-11-12。

## 安装

1. 退出游戏，完整备份存档文件夹。Steam 版通常位于 `<游戏目录>/ProjectPBZ/Saved/SaveGames/Steam/<账号文件夹>/`。
2. 按原作者说明安装 [PBZModLoader](https://github.com/zoneoflkf/PBZModLoader)。加载器需要单独下载。
3. 在 [GitHub Releases](https://github.com/dcy-2020/PBZManualSave500/releases) 或 [N 网 Files 页面](https://www.nexusmods.com/phantombladezero/mods/1080?tab=files)下载 `PBZ-Manual-Save-500-v1.0.0.zip`，解压到含有 `ProjectPBZ` 文件夹的游戏根目录。
4. 确认文件路径如下，然后正常启动游戏：

```text
<游戏目录>/ProjectPBZ/PBZModLoader/mods/PBZManualSave500/main.js
```

在普通手动存档界面检查计数，应显示 `/500`。

## 修改机制

Mod 在首次打开存档界面前，将 `SaveGameInterface.prototype.getManualSaveSlotCap()` 的返回值改为 `500`。真实数量、槽名分配、保存和读取继续由游戏处理；达到 500 时仍保留已满提示。

本 Mod 扩展的是手动存档。自动存档和极难周目专用槽沿用游戏原有机制。

## 更新与卸载

退出游戏后，替换或移除 `ProjectPBZ/PBZModLoader/mods/` 下的 `PBZManualSave500` 文件夹。安装、卸载或更新后都请完整重启游戏。

卸载不会删除存档文件。已有超过 20 个手动档时，也请先做好完整备份再卸载。

## 兼容与反馈

面向 Steam PC 版和 PBZModLoader。游戏更新或其他 Mod 修改同一个容量函数时，兼容检查可能阻止本 Mod 应用；可在加载器日志中搜索 `PBZManualSave500`，日志位置见加载器说明。

只安装一份。如果自定义 `mods.ini` 禁用了本 Mod，请按加载器说明启用 `PBZManualSave500`。问题可在本 Mod 的 N 网页面 Posts（评论）区反馈，注明游戏 build 和加载器版本，避免在公开反馈中附带私人存档或账号信息。

## 作者与来源

作者：[dcy2020](https://www.nexusmods.com/profile/dcy2020)。代码与文档使用生成式 AI 开发，作者已进行游戏内测试。包内 `main.js` 即完整 Mod 源码，采用 [MIT 许可](LICENSE)。

依赖由 LKF 创建的 [PBZModLoader](https://github.com/zoneoflkf/PBZModLoader)。加载器单独下载，遵循其自身许可。见 [第三方说明](THIRD_PARTY.md)。
