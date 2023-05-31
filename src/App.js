import "./App.css";
import React, { useState, useEffect } from "react";

const CountrySelector = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isConfirmationDisplayed, setIsConfirmationDisplayed] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countriesData = data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        countriesData.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countriesData);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleCountrySelect = (countryCode) => {
    if (!selectedCountries.includes(countryCode)) {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  const handleCountryRemove = (countryCode) => {
    const updatedCountries = selectedCountries.filter(
      (selectedCountry) => selectedCountry !== countryCode
    );
    setSelectedCountries(updatedCountries);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleValidationClick = () => {
    if (selectedCountries.length > 0) {
      setIsConfirmationDisplayed(true);
    }
  };

  const handleSendClick = () => {
    setIsConfirmationDisplayed(false);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="content">
      <h1>Sélectionnez des pays :</h1>
      <div className="countries-section">
        <div className="countries-list">
          <input
            type="text"
            placeholder="Rechercher un pays"
            value={searchText}
            onChange={handleSearchTextChange}
            className="search-input"
          />
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountrySelect(country.code)}
              disabled={selectedCountries.includes(country.code)}
            >
              {country.name}
            </button>
          ))}
        </div>
        <div className="validation">
          {selectedCountries.length > 0 && (
            <div className="selected-countries">
              <h4>Pays sélectionnés :</h4>
              {selectedCountries.map((countryCode) => {
                const country = countries.find((c) => c.code === countryCode);
                if (country) {
                  return (
                    <span key={country.code} className="tag">
                      {country.name}
                      <button
                        onClick={() => handleCountryRemove(country.code)}
                        className="btn-delete"
                      >
                        x
                      </button>
                    </span>
                  );
                }
                return null;
              })}
              <br />
              <button onClick={handleValidationClick} className="btn-country">
                {isConfirmationDisplayed ? "Valider" : "Valider"}
              </button>
            </div>
          )}
          {isConfirmationDisplayed && (
            <div className="mail">
              <input
                className="input-email"
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={handleEmailChange}
                onBlur={validateEmail}
              />
              <br />
              {!isEmailValid && (
                <p>Veuillez saisir une adresse email valide.</p>
              )}
              <button
                className="btn-email"
                disabled={!isEmailValid}
                onClick={handleSendClick}
              >
                Envoyer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;
