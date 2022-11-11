import { useEffect, useState } from "react";
import TextBox from "./components/TextBox";
import Arrows from "./components/Arrows";
import Button from "./components/Button";
import Modal from "./components/Modal";
import axios from "axios";
// import fetch from "node-fetch";

const App = () => {
  // useState ile input ve output dillerini takip ediyorum.
  const [inputLanguage, setInputLanguage] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("English");
  // Modal'ı handle etmek için;
  const [showModal, setShowModal] = useState(null);
  // Languages
  const [languages, setLanguages] = useState(null);
  // Text input
  const [textToTranslate, setTextToTranslate] = useState("");
  // Translated text
  const [translatedText, setTranslatedText] = useState("");

  const getLanguages = async () => {
    // RapidAPI Google Translate GET Languages
    const options = {
      method: "GET",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
      params: { target: "en" },
      headers: {
        // "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "66a1dce359msh19a1369f4144bb6p166940jsnf5aa3699069e",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        // console.log(response.data);
        const langArray = [];
        response.data.data.languages.forEach((key) => langArray.push(key.name));

        const langMap = new Map();
        response.data.data.languages.forEach((key) =>
          langMap.set(`${key.language}`, `${key.name}`)
        );

        console.log(langMap);
        setLanguages(langArray);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getLanguages();
  }, []);

  // const translate = async () => {
  //   const encodedParams = new URLSearchParams();
  //   encodedParams.append("q", textToTranslate);
  //   encodedParams.append("target", outputLanguage);
  //   encodedParams.append("source", inputLanguage);

  //   const options = {
  //     method: "POST",
  //     url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
  //     headers: {
  //       "content-type": "application/x-www-form-urlencoded",
  //       // "Accept-Encoding": "application/gzip",
  //       "X-RapidAPI-Key": "66a1dce359msh19a1369f4144bb6p166940jsnf5aa3699069e",
  //       "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
  //     },
  //     data: encodedParams,
  //   };

  //   axios
  //     .request(options)
  //     .then((response) => {
  //       console.log(response.data);
  //       setTranslatedText(response.data.translations.translatedText);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  // const fetch = require("node-fetch");

  const translate = async () => {
    const encodedParams = new URLSearchParams();
    encodedParams.append("q", textToTranslate);
    encodedParams.append("target", outputLanguage);
    inputLanguage !== "" && encodedParams.append("source", inputLanguage);

    const url =
      "https://google-translate1.p.rapidapi.com/language/translate/v2";

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        // "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "66a1dce359msh19a1369f4144bb6p166940jsnf5aa3699069e",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      body: encodedParams,
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) =>
        // setTranslatedText(json.data.translations[0].translatedText)
        console.log(json)
      )
      .catch((err) => console.error("error:" + err));
  };

  // console.log(translatedText);

  const handleClick = () => {
    // ortadaki çift yönlü oka tıklandığında input'u output olarak, output'u ise input'a set'lenmesini sağladım.
    // böylelikle tıpkı google translate'teki gibi taraf değiştirecek.
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
  };

  // console.log(inputLanguage);

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
