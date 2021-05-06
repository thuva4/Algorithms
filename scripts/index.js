const fs = require("fs");
const algorithmsFolder = "../algorithms/";

const readMeFileName = "../README";

const languageAlgorithmMap = {};

const algorithmCountMap = {};

const getReadHeaderAndFooter = () => {
  const headerAndFooterData = fs.readFileSync("readme-header-footer.json");
  return JSON.parse(headerAndFooterData);
};

const readLanguages = () => {
  const languages = fs
    .readdirSync(algorithmsFolder, {
      withFileTypes: true,
    })
    .reduce((a, c) => {
      c.isDirectory() && a.push(c.name);
      return a;
    }, []);
  languages.forEach((language) => {
    const algorithms = readAlgorithms(language);
    languageAlgorithmMap[language] = algorithms;
    algorithms.forEach((algorithm) => {
      if (algorithmCountMap[algorithm]) {
        algorithmCountMap[algorithm] += 1;
      } else {
        algorithmCountMap[algorithm] = 1;
      }
    });
  });

  const languageSorted = Object.keys(languageAlgorithmMap).sort(function (
    a,
    b
  ) {
    return languageAlgorithmMap[b].length - languageAlgorithmMap[a].length;
  });

  const rows = [];

  rows.push(generateSubHeader(languageSorted.length));
  let algorithms = Object.keys(algorithmCountMap).sort(function (a, b) {
    return algorithmCountMap[b] - algorithmCountMap[a];
  });
  algorithms.forEach((algorithm) => {
    rows.push(generateAlgorithmRow(algorithm, languageSorted));
  });

  const readHeaderAndFooter = getReadHeaderAndFooter();

  Object.keys(readHeaderAndFooter).forEach((lang) => {
    let fileName;
    if (lang === "Default") {
      fileName = `${readMeFileName}.md`;
    } else {
      fileName = `${readMeFileName}-${lang}.md`;
    }
    const data = [
      readHeaderAndFooter[lang].Header,
      generateHeaderRow(languageSorted, readHeaderAndFooter[lang].Language),
      ...rows,
      readHeaderAndFooter[lang].Footer,
    ].join("\n");
    fs.writeFile(fileName, data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log(`The file was saved! ${lang}`);
    });
  });
};

const readAlgorithms = (language) => {
  const languageFolder = `${algorithmsFolder}${language}/`;
  const algorithms = fs
    .readdirSync(languageFolder, {
      withFileTypes: true,
    })
    .reduce((a, c) => {
      c.isDirectory() && c.name != "node_modules" && a.push(c.name);
      return a;
    }, []);
  return algorithms;
};

const generateHeaderRow = (languages, language) => {
  const headerRow = [language, ...languages, ""];
  const header = headerRow.join(" | ");
  return header;
};

const generateSubHeader = (count) => {
  const subHeaderElement = "|:---:";
  let subHeaderRow = "";
  for (let i = 0; i < count + 1; i += 1) {
    subHeaderRow += subHeaderElement;
  }
  subHeaderRow += "|";
  return subHeaderRow;
};

const generateAlgorithmRow = (algorithm, languages) => {
  const algorithmRow = [algorithm];
  languages.forEach((language) => {
    const algorithmsForLanguage = languageAlgorithmMap[language];
    if (
      algorithmsForLanguage &&
      algorithmsForLanguage.indexOf(`${algorithm}`) >= 0
    ) {
      algorithmRow.push(":+1:");
    } else {
      algorithmRow.push(" ");
    }
  });
  algorithmRow.push("");

  const row = algorithmRow.join(" | ");
  return row;
};

readLanguages();

