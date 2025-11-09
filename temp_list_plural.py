import json
from pathlib import Path
english = json.load(open(Path('packages/react-ui/public/locales/en/translation.json'), encoding='utf-8'))
plural_keys = [k for k,v in english.items() if 'plural' in v]
print(len(plural_keys))
print(plural_keys)
