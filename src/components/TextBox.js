import SelectDropDown from "./SelectDropDown";

const TextBox = ({ selectedLanguage, style, setShowModal }) => {
  return (
    <div className={style}>
      <SelectDropDown
        selectedLanguage={selectedLanguage}
        style={style}
        setShowModal={setShowModal}
      />
      <textarea
        placeholder={style === "input" ? "Enter Text" : "Translation"}
        disabled={style === "output"}
      />
    </div>
  );
};

export default TextBox;
