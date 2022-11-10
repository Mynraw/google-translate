import { useEffect, useState } from "react";
import TextBox from "./components/TextBox";
import Arrows from "./components/Arrows";
import Button from "./components/Button";
import Modal from "./components/Modal";
import axios from "axios";

const App = () => {
  // useState ile input ve output dillerini takip ediyorum.
  const [inputLanguage, setInputLanguage] = useState("Turkish");
  const [outputLanguage, setOutputLanguage] = useState("English");
  // Modal'ı handle etmek için;
  const [showModal, setShowModal] = useState(null);
  // Languages
  const [languages, setLanguages] = useState(null);

  const getLanguages = async () => {
    // RapidAPI Google Translate GET Languages
    const options = {
      method: "GET",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
      headers: {
        // "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "66a1dce359msh19a1369f4144bb6p166940jsnf5aa3699069e",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        const langArray = Object.keys(response.data.data).map(
          (key) => response.data.data[key]
        );
        setLanguages(langArray);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log("languages", languages);

  useEffect(() => {
    getLanguages();
  }, []);

  const handleClick = () => {
    // ortadaki çift yönlü oka tıklandığında input'u output olarak, output'u ise input'a set'lenmesini sağladım.
    // böylelikle tıpkı google translate'teki gibi taraf değiştirecek.
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
  };

  // console.log("showModal", showModal);

  return (
    <div className="app">
      {/* eğer showModal boş ise; */}
      {!showModal && (
        <>
          <TextBox
            selectedLanguage={inputLanguage}
            style="input"
            setShowModal={setShowModal}
          />
          <div className="arrow-container" onClick={handleClick}>
            <Arrows />
          </div>
          <TextBox
            selectedLanguage={outputLanguage}
            style="output"
            setShowModal={setShowModal}
          />
        </>
      )}
      {showModal && <Modal setShowModal={setShowModal} />}
    </div>
  );
};

export default App;
