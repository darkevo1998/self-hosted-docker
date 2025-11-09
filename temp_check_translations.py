import json
from pathlib import Path
root = Path('packages/react-ui/public/locales')
english = json.load(open(root/'en/translation.json', encoding='utf-8'))
for lang_dir in root.iterdir():
    if not lang_dir.is_dir() or lang_dir.name == 'en':
        continue
    path = lang_dir / 'translation.json'
    if not path.exists():
        print(lang_dir.name, 'missing translation.json')
        continue
    data = json.load(open(path, encoding='utf-8'))
    missing = sorted(set(english) - set(data))
    extras = sorted(set(data) - set(english))
    empty = [k for k, v in data.items() if isinstance(v, str) and (not v.strip())]
    same = [k for k, v in data.items() if english.get(k) == v]
    print(f'Language {lang_dir.name}: missing {len(missing)}, extra {len(extras)}, empty {len(empty)}, identical {len(same)}')
    if missing:
        print('  Missing example:', missing[:5])
    if extras:
        print('  Extra example:', extras[:5])
    if same:
        print('  Identical example:', same[:5])
