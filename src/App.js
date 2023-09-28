/* global chrome */

import React, { useState, useEffect } from "react";
import "./App.css"; // your CSS file
import cart from "./images/cart.png";
import arrow from "./images/arrow.png";

function App() {
  const [professorInformationList, setProfessorInformationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [currentLoadingPhrase, setCurrentLoadingPhrase] = useState(
    "We are in the process of getting professors reviews and ratings."
  );
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [rotateArrow, setRotateArrow] = useState(false);

  const loadingPhrases = [
    "Rate my professor reviews are not always reliable. We do our best to get the the most relevent points to help you make the best choice for you.",
    "We save results for the professors that are searched for so you can quickly access them later.",
  ];

  const fetchData = () => {
    setIsLoading(true);

    // You can replace this with actual API logic
    const tempData = {
      professorNames: [
        "deborah abel",
        "tatiana genin",
        "juan pereira",
        "gianno feoli",
      ],
    };

    fetch("http://127.0.0.1:5000/queryProfessorResults", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempData),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setShowButton(false);
        setProfessorInformationList(data.professorInformationList);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("API call failed:", error);
      });
  };
  useEffect(() => {
    if (isLoading) {
      let index = 0;
      const interval = setInterval(() => {
        setCurrentLoadingPhrase(loadingPhrases[index]);
        index = (index + 1) % 3;
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleFindButtonClick = () => {
    setShowButton(false);
    fetchData();
  };

  const handleArrowClick = (professorName) => {
    setRotateArrow(!rotateArrow); // Toggle the rotate state
    if (selectedProfessor === professorName) {
      setSelectedProfessor(null);
    } else {
      setSelectedProfessor(professorName);
    }
  };

  // function handleCardClick() {
  //   console.log("Card clicked.");

  //   const boxes = document.querySelectorAll(".child-container");
  //   boxes.forEach((innerBox) => {
  //     if (innerBox !== this) {
  //       innerBox.style.display = "none";
  //     } else {
  //       innerBox.classList.add("expanded");
  //     }
  //   });
  // }

  return (
    <body>
      {showButton && (
        <button
          className={isLoading ? "initial button loading" : "initial button"}
          onClick={handleFindButtonClick}
        ></button>
      )}
      {isLoading && (
        <div className="initial summary">{currentLoadingPhrase}</div>
      )}

      {!isLoading && !showButton && (
        <div
          className={`container ${
            selectedProfessor === null ? "" : "container--summary"
          } `}
          id="mainContainer"
        >
          {Object.entries(professorInformationList)
            .slice(0, 3)
            .map(([professorName, info]) => (
              <React.Fragment key={professorName}>
                {(selectedProfessor === null ||
                  selectedProfessor === professorName) && (
                  <div className="child-container">
                    {console.log(info.avgDifficulty)}
                    {console.log(info.avgRating)}
                    {console.log(info.sentiment)}
                    <div className="card_left">
                      <div className="card_titles">
                        <div className="card_title">Overall</div>
                        <div className="card_title">Difficulty</div>
                        <div className="card_title">Take Again</div>
                      </div>
                      <div className="card_ratings">
                        <div className="card_rating">{`${info.avgRating}`}</div>
                        <div className="card_rating">{`${info.avgDifficulty}`}</div>
                        <div className="card_rating">{`${info.sentiment}`}</div>
                      </div>
                      <div className="card_bottom">
                        <div className="card_name">{professorName}</div>
                        <img
                          className="card_cart"
                          src={cart}
                          alt="shopping cart"
                        />
                      </div>
                    </div>
                    <div
                      className="card_right"
                      onClick={() => handleArrowClick(professorName)}
                    >
                      <img
                        className={`arrow ${rotateArrow ? "rotate" : ""}`}
                        src={arrow}
                        alt="drop down arrow"
                      />
                    </div>
                  </div>
                )}
                {selectedProfessor === professorName && (
                  <div className="summary-container">
                    {/* Render your summary component or JSX here */}
                    <p>{info.summary}</p>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      )}
    </body>
  );
}

export default App;
