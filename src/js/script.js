import { createQueryString, FetchData, getCached, setCached } from "./utilities";
import rapidAPIKey from "../../API_KEY";

const requests = {
  languages: [
    "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
    {
      method: "GET",
      headers: {
        "accept-encoding": "application/gzip",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
        "x-rapidapi-key": rapidAPIKey,
      },
    },
  ],
  detectLanguage: (text) => [
    "https://google-translate1.p.rapidapi.com/language/translate/v2/detect",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "application/gzip",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
        "x-rapidapi-key": rapidAPIKey,
        // useQueryString: true,
      },
      body: createQueryString({
        q: text,
      }),
    },
  ],
  translate: (text, destLang, inputLang) => [
    "https://google-translate1.p.rapidapi.com/language/translate/v2",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "application/gzip",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
        "x-rapidapi-key": rapidAPIKey,
      },
      body: createQueryString({
        q: text,
        target: destLang,
        source: inputLang,
      }),
    },
  ],
};

(async function populateLanguages() {
  let allLanguages = getCached("allLanguages");

  if (!allLanguages) {
    allLanguages = await FetchData(...requests.languages).then((data) => data.data.languages.map((lang) => lang.language));
    setCached("allLanguages", allLanguages);
  }

  const select = document.getElementById("languages");
  allLanguages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.innerHTML = lang;
    select.appendChild(option);
  });
})();

document.getElementById("translate").addEventListener("click", async function doTranslation(e) {
  const _buttonText = this.innerHTML;
  this.innerHTML = "Loading...";
  const textToTranslate = document.getElementById("text-to-translate").value;
  const inputLang = await FetchData(...requests.detectLanguage(textToTranslate)).then((data) => {
    return data.data.detections[0][0].language;
  });
  const destLang = document.getElementById("languages").value;
  const translatedText = await FetchData(...requests.translate(textToTranslate, destLang, inputLang)).then((data) => {
    return data.data.translations[0].translatedText;
  });
  document.getElementById("text-translated").value = translatedText;
  this.innerHTML = _buttonText;
});
