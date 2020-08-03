import os, sys, json, io
from fuzzywuzzy import fuzz

languageData = open("readme-header-footer.json", "r")
readmeLanguages = json.load(languageData, encoding='utf-8')
readmes = []

for lang in readmeLanguages:
    if lang != "Default":
        readme = io.open("../README-{}.md".format(lang), "w", encoding='utf-8')
        readme.write(readmeLanguages[lang]["Header"] + u"\r\n")
        readme.write(u"\r\n")
        readmes.append(readme)
    else:
        readme = io.open("../README.md", "w", encoding='utf-8')
        readme.write(readmeLanguages[lang]["Header"] + u"\r\n")
        readme.write(u"\r\n")
        readmes.append(readme)


def tokenize(string):
    tokens = []
    current_word = ''
    for char in string:
        if char == '_' or char == ' ' or char == '-':
            tokens.append(current_word)
            current_word = ''
        elif char.isupper() and not current_word.isupper():
            tokens.append(current_word)
            current_word = char
        else:
            if len(current_word) == 0:
                current_word = char.upper()
            else:
                current_word += char
    tokens.append(current_word)
    return [t for t in tokens if t != '']


def to_std_case(string):
    return ' '.join(tokenize(string))


class AlgorithmTranslator:
    def __init__(self):
        self.algos = []

    def translate(self, algo):
        algo_std = to_std_case(algo)
        for a in self.algos:
            if fuzz.partial_ratio(a, algo_std) > 85:
                return a
        self.algos.append(algo_std)
        return algo_std


translator = AlgorithmTranslator()
cwd = os.getcwd()
accumulator = {}
languages = sorted([f for f in os.listdir(cwd) if os.path.isdir(f) and not f.startswith('.')])
for language in languages:
    accumulator[language] = []
    algos = [f for f in os.listdir(os.path.join(cwd, language)) if not f.startswith('.')]
    for algo in algos:
        translated = translator.translate(algo)
        accumulator[language].append(translated)

for readme in readmes:
    lang = "Default"
    if readme.name.split(".")[0].split("-").__len__() > 1:
        lang = readme.name.split(".")[0].split("-")[1]
    readme.write(u'{} | '.format(readmeLanguages[lang]["Language"]) + u' | '.join(languages) + '|' + u'\r\n')
    readme.write(u'---|' + '|'.join([':---:' for _ in languages]) + '|' + u'\r\n')
    for algo in sorted(translator.algos):
        readme.write( u'{} | '.format(algo) + u' | '.join(':+1:' if algo in accumulator[l] else ' ' for l in languages) + u'|' + u'\r\n')

# readme.write('Language | ' + ' | '.join(languages) + '|' + '\n')


for readme in readmes:
    lang = "Default"
    if readme.name.split(".")[0].split("-").__len__() > 1:
        lang = readme.name.split(".")[0].split("-")[1]
    readme.write(u"\r\n")
    readme.write(readmeLanguages[lang]["Footer"] + u"\r\n")
    readme.write(u"\r\n")

# with open('readme-postlist.md') as post:
#     for line in post.readlines():
#         readme.write(line)
