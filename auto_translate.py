import json
import time
import re
from pathlib import Path
from deep_translator import GoogleTranslator, exceptions

root = Path('packages/react-ui/public/locales')
english_path = root / 'en' / 'translation.json'
english = json.load(open(english_path, encoding='utf-8'))

language_map = {
    'ar': 'ar',
    'de': 'de',
    'es': 'es',
    'fr': 'fr',
    'ja': 'ja',
    'nl': 'nl',
    'pt': 'pt',
    'ru': 'ru',
    'zh': 'zh-CN',
    'zh-TW': 'zh-TW',
}

simple_placeholder_re = re.compile(r"\{[\w.]+\}")

plural_keys = {k for k, v in english.items() if 'plural' in v}


def mask_placeholders(text):
    placeholders = {}

    def repl(match):
        token = f"__PH{len(placeholders)}__"
        placeholders[token] = match.group(0)
        return token

    masked = simple_placeholder_re.sub(repl, text)
    return masked, placeholders


def unmask(text, placeholders):
    for token, original in placeholders.items():
        text = text.replace(token, original)
    return text


def translate_text(text, dest, attempts=3):
    translator = GoogleTranslator(source='en', target=dest)
    last_error = None
    for attempt in range(attempts):
        try:
            return translator.translate(text)
        except exceptions.NotValidPayload:
            return text
        except exceptions.TranslationNotFound as err:
            last_error = err
            time.sleep(1.0)
        except Exception as err:  # noqa: BLE001
            last_error = err
            time.sleep(1.0)
    if last_error:
        print(f"Warning: failed to translate '{text[:60]}...' to {dest}: {last_error}")
    return text


def translate_batch(texts, dest):
    translated = []
    for text in texts:
        translated.append(translate_text(text, dest))
        time.sleep(0.1)
    return translated


for lang_dir in root.iterdir():
    lang = lang_dir.name
    if lang == 'en' or not lang_dir.is_dir():
        continue
    if lang not in language_map:
        print(f'Skipping unsupported language directory: {lang}')
        continue
    dest_code = language_map[lang]
    path = lang_dir / 'translation.json'
    existing = {}
    if path.exists():
        existing = json.load(open(path, encoding='utf-8'))
    to_translate = []
    order = []
    new_data = {}
    for key, english_value in english.items():
        order.append(key)
        current_value = existing.get(key, '')
        if key in plural_keys:
            new_data[key] = current_value if current_value else english_value
            continue
        needs_translation = (
            not isinstance(current_value, str) or
            not current_value.strip() or
            current_value.strip() == english_value.strip()
        )
        if not needs_translation:
            new_data[key] = current_value
            continue
        masked, placeholders = mask_placeholders(english_value)
        to_translate.append((key, masked, placeholders, english_value))
    if to_translate:
        translated_texts = translate_batch([item[1] for item in to_translate], dest=dest_code)
        for (key, _, placeholders, english_value), translated_value in zip(to_translate, translated_texts):
            if isinstance(translated_value, str) and translated_value.strip():
                restored = unmask(translated_value, placeholders)
            else:
                restored = english_value
            new_data[key] = restored
    for key in order:
        if key not in new_data:
            new_data[key] = existing.get(key, english[key])
    ordered = {key: new_data.get(key, english[key]) for key in english.keys()}
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(ordered, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f'Updated {lang}')

print('Done.')
