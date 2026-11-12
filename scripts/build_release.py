"""Build a deterministic player archive from an explicit, checked allowlist."""
from pathlib import Path
import hashlib
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
MOD = 'ProjectPBZ/PBZModLoader/mods/PBZManualSave500/'
FILES = {
    MOD + 'main.js': MOD + 'main.js',
    'README.md': MOD + 'README.md',
    'README.zh-CN.md': MOD + 'README.zh-CN.md',
    'LICENSE': MOD + 'LICENSE',
    'THIRD_PARTY.md': MOD + 'THIRD_PARTY.md',
}
EXPECTED_SCRIPT_SHA256 = '2f7a75f070e619efedf7243c82efa61182b87c41e968c487acb1299532a3839a'
WARNING = '重要提示：涉及存档操作，请妥善备份好存档。'
assert hashlib.sha256((ROOT / (MOD + 'main.js')).read_bytes()).hexdigest() == EXPECTED_SCRIPT_SHA256
for name in ('README.md', 'README.zh-CN.md', 'releases/v1.0.0.md', 'publishing/Nexus-description.bbcode'):
    assert WARNING in (ROOT / name).read_text(encoding='utf-8').splitlines()[0], name

# Only this self-contained public source directory is inspected or archived.
blocked_account = re.compile(r'\b7656119[0-9]{10}\b')
blocked_path = re.compile(r'[A-Za-z]:[\\/](?:Users|SteamLibrary|Games)[\\/]', re.IGNORECASE)
blocked_suffixes = {'.sav', '.exe', '.dll', '.wasm', '.j', '.pak', '.log', '.key'}
for path in ROOT.rglob('*'):
    if not path.is_file() or any(part in {'.git', 'dist', '__pycache__', 'node_modules'} for part in path.relative_to(ROOT).parts):
        continue
    assert path.suffix.lower() not in blocked_suffixes, path.name
    text = path.read_text(encoding='utf-8')
    assert not blocked_account.search(text), path.name
    assert not blocked_path.search(text), path.name

out = ROOT / 'dist'
out.mkdir(exist_ok=True)
archive = out / f'PBZ-Manual-Save-500-v{VERSION}.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as package:
    for source, destination in sorted(FILES.items(), key=lambda item: item[1]):
        item = zipfile.ZipInfo(destination, date_time=(2026, 11, 12, 0, 0, 0))
        item.compress_type = zipfile.ZIP_DEFLATED
        item.create_system = 3
        item.external_attr = 0o100644 << 16
        package.writestr(item, (ROOT / source).read_bytes())

with zipfile.ZipFile(archive) as package:
    assert package.testzip() is None
    assert sorted(package.namelist()) == sorted(FILES.values())
    for source, destination in FILES.items():
        assert package.read(destination) == (ROOT / source).read_bytes()

digest = hashlib.sha256(archive.read_bytes()).hexdigest()
SOURCE_FILES = [
    '.gitignore', 'CHANGELOG.md', 'LICENSE', 'package.json', 'README.md',
    'README.zh-CN.md', 'THIRD_PARTY.md', MOD + 'main.js',
    'publishing/Nexus-fields.json', 'publishing/Nexus-description.bbcode',
    'releases/v1.0.0.md', 'scripts/build_release.py', 'tests/mod.test.mjs',
]
source_archive = out / f'PBZManualSave500-v{VERSION}-source.zip'
with zipfile.ZipFile(source_archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as package:
    for source in sorted(SOURCE_FILES):
        item = zipfile.ZipInfo(f'PBZManualSave500/{source}', date_time=(2026, 11, 12, 0, 0, 0))
        item.compress_type = zipfile.ZIP_DEFLATED
        item.create_system = 3
        item.external_attr = 0o100644 << 16
        package.writestr(item, (ROOT / source).read_bytes())
with zipfile.ZipFile(source_archive) as package:
    assert package.testzip() is None
    assert sorted(package.namelist()) == sorted(f'PBZManualSave500/{s}' for s in SOURCE_FILES)
    for source in SOURCE_FILES:
        assert package.read(f'PBZManualSave500/{source}') == (ROOT / source).read_bytes()
source_digest = hashlib.sha256(source_archive.read_bytes()).hexdigest()
(out / 'SHA256SUMS.txt').write_text(
    f'{digest}  {archive.name}\n{source_digest}  {source_archive.name}\n', encoding='ascii')
print(json.dumps({'player_archive': archive.name, 'bytes': archive.stat().st_size,
                 'sha256': digest, 'files': list(FILES.values()),
                 'source_archive': source_archive.name, 'source_sha256': source_digest,
                 'source_files': len(SOURCE_FILES)}, indent=2))
