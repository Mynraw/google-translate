import { useEffect, useState } from "react";
import TextBox from "./components/TextBox";
import Arrows from "./components/Arrows";
import Button from "./components/Button";
import Modal from "./components/Modal";
import axios from "axios";
// import fetch from "node-fetch";

const App = () => {
  // useState ile input ve output dillerini takip ediyorum.
  const [inputLanguage, setInputLanguage] = useState("Turkish");
  const [outputLanguage, setOutputLanguage] = useState("English");
  // state for language codes
  const [inputLanguageCode, setInputLanguageCode] = useState("");
  const [outputLanguageCode, setOutputLanguageCode] = useState("");
  // Modal'ı handle etmek için;
  const [showModal, setShowModal] = useState(null);
  // Languages
  const [languages, setLanguages] = useState(null);
  // Text input
  const [textToTranslate, setTextToTranslate] = useState("");
  // Translated text
  const [translatedText, setTranslatedText] = useState("");
  // Map for language data
  const [langMap, setLangMap] = useState(new Map());

  const getLanguages = () => {
    // RapidAPI Google Translate GET Languages
    const options = {
      method: "GET",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
      params: { target: "en" },
      headers: {
        // "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "78ca1c5d98msh668f0af6e8f8724p12ac7ejsn7313e5ac5fb0",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        // console.log(response.data);
        // response.data.data.languages.forEach((key) => langArray.push(key.name));
        response.data.data.languages.forEach((key) =>
          // langMap.set(`${key.name}`, `${key.language}`)
          setLangMap(langMap.set(`${key.name}`, `${key.language}`))
        );
        setLanguages([...langMap.keys()]);

        // initial set
        setInputLanguageCode(langMap.get(inputLanguage));
        setOutputLanguageCode(langMap.get(outputLanguage));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // [] => only runs on the first render
  useEffect(() => {
    getLanguages();
  }, []);

  const getLangCode = () => {
    // gotta get the language code. v2 Translate API requires that.
    setInputLanguageCode(langMap.get(inputLanguage));
    setOutputLanguageCode(langMap.get(outputLanguage));
    // console.log(inputLanguageCode);
    // console.log(outputLanguageCode);
  };

  // runs at the first render and whenever inputLanguage and outputLanguage values has changed
  useEffect(() => {
    getLangCode();
  }, [inputLanguage, outputLanguage]);

  const translate = () => {
    const encodedParams = new URLSearchParams();
    encodedParams.append("q", textToTranslate);
    encodedParams.append("target", outputLanguageCode);
    inputLanguage !== "" && encodedParams.append("source", inputLanguageCode);

    const url =
      "https://google-translate1.p.rapidapi.com/language/translate/v2";

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        // "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "78ca1c5d98msh668f0af6e8f8724p12ac7ejsn7313e5ac5fb0",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      body: encodedParams,
    };

    fetch(url, options)
      .then((res) => res.json())
      .then(
        (json) => setTranslatedText(json.data.translations[0].translatedText)
        // console.log(json);
      )
      .catch((err) => console.error("error:" + err));
  };

  const handleClick = () => {
    // ortadaki çift yönlü oka tıklandığında input'u output olarak, output'u ise input'a set'lenmesini sağladım.
    // böylelikle tıpkı google translate'teki gibi taraf değiştirecek.
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
  };

  return (
    <div className="app">
      {/* eğer showModal boş ise; */}
      {!showModal && (
        <>
          <TextBox
            selectedLanguage={inputLanguage}
            style="input"
            setShowModal={setShowModal}
            textToTranslate={textToTranslate}
            setTextToTranslate={setTextToTranslate}
            setTranslatedText={setTranslatedText}
          />
          <div className="arrow-container" onClick={handleClick}>
            <Arrows />
          </div>
          <TextBox
            selectedLanguage={outputLanguage}
            style="output"
            setShowModal={setShowModal}
            translatedText={translatedText}
          />
          <div className="button-container" onClick={translate}>
            <Button />
          </div>
        </>
      )}
      {showModal && (
        <Modal
          getLangCode={getLangCode}
          setInputLanguageCode={
            showModal === "input" ? setInputLanguageCode : setOutputLanguageCode
          }
          setShowModal={setShowModal}
          languages={languages}
          chosenLanguage={
            showModal === "input" ? inputLanguage : outputLanguage
          }
          setChosenLanguage={
            showModal === "input" ? setInputLanguage : setOutputLanguage
          }
        />
      )}
    </div>
  );
};

export default App;
