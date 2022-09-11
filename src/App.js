import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import correct from "./correctt.mp3";
import incorrect from "./wrong.mp3";
import Scare from "./scare.js";
import Scream from "./scream.mp3";

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function App() {
  var scream = new Audio(Scream);
  const pages = {
    GAME: "GAME",
    SCARE: "SCARE",
  };
  const [currentPage, setCurrentPage] = useState(pages.GAME);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      setRunning(true);
    }
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 30);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);
  const [points, setPoints] = useState(0);
  var correctSound = new Audio(correct);
  var incorrectSound = new Audio(incorrect);
  const [colorArray, setColorArray] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [toggleInterval, setToggleInterval] = useState(1400);
  const playResultEffect = (index) => {
    console.log("You have ", { points }, "points");
    if (points === randomIntFromInterval(20, 70)) {
      setCurrentPage(pages.SCARE);
      scream.play();
      console.log("you win");
    }
    if (colorArray[index] === 1) {
      correctSound.play();
      setPoints((previousNum) => {
        return previousNum + 1;
      });
    } else {
      incorrectSound.play();
      setPoints((previousNum) => {
        return previousNum - 1;
      });
    }
  };

  useEffect(() => {
    const interval2 = setInterval(() => {
      setToggleInterval((prev) => {
        if (prev > 200) {
          return prev - 200;
        } else {
          return prev;
        }
      });
    }, 500);

    return () => {
      clearInterval(interval2);
    };
  }, [toggleInterval]);

  useEffect(() => {
    const interval = setInterval(() => {
      const available = [];
      for (let i = 0; i < 16; i++) {
        if (colorArray[i] === 0) {
          available.push(i);
        }
      }
      const randomNum = randomIntFromInterval(0, available.length);
      const choice = available[randomNum];
      setColorArray((prev) => {
        const copy = [...prev];
        copy[choice] = 1;
        return copy;
      });
    }, toggleInterval);

    return () => {
      clearInterval(interval);
    };
  }, [colorArray, toggleInterval]);
  if (currentPage === pages.GAME) {
    return (
      <div className="App">
        <div className="timer">
          <p>Stopwatch</p>

          <span className="main">
            {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
          </span>
          <span className="main">
            {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
          </span>
          <span className="main">{("0" + ((time / 10) % 100)).slice(-2)}</span>
        </div>
        <div className="whole">
          <p className="title">🔊 On! Reaction Test - Score {[points]} </p>

          <div className="wrapper">
            {colorArray.map((colorCode, i) => (
              <div key={i}>
                <button
                  className={colorCode === 0 ? "button" : "button green"}
                  onClick={() =>
                    setColorArray((prev) => {
                      const copy = [...prev];
                      copy[i] = 0;
                      playResultEffect(i);
                      return copy;
                    })
                  }
                ></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <Scare />;
  }
}

export default App;
