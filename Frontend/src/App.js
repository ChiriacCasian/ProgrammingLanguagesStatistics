///import './App.css';
import './Style.css';
import {Shape} from "./MainPageComponents";
import React, {useEffect, useRef, useState} from "react";
import 'animate.css';
import axios from "axios"

let globHover = false;
let avgSalaryMax = -1 ;
let listingsMax = -1 ;
function App() {
    const [tilez, setTilez] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3030/getTiles')
            .then(response => {
                setTilez([...response.data].sort((a, b) => b.rankingCoef - a.rankingCoef));
            })
            .catch(error => {
                console.error("There was an error fetching the tiles!", error);
            });
    }, []); /// there are no external dependencies that can trigger useEffect to rerun
    avgSalaryMax = Math.max(...tilez.map(x => x.avgSalary));
    listingsMax = Math.max(...tilez.map(x => x.listings));
    const mainTriangleColor = getComputedStyle(document.documentElement).getPropertyValue('--4green').trim();
    const opaqueTriangleColor = getComputedStyle(document.documentElement).getPropertyValue('--4green').trim();
    const viewportWidth = window.innerWidth;

    return (
      <div className="mainDiv">
          {TopLeftTriangle( 18/100 * viewportWidth, mainTriangleColor, opaqueTriangleColor)}
            <div className={`blurArea ${globHover ? "blurAreaHover" : ""}`}>
          <header>
              <h1 className="titleHeader"><span className="offsetText"><div className="animateTitle">🔥</div></span></h1>
              <h1 className="rotatingTextDiv">
                  <div className="rotatingText">
                  Nr. 1 -> {tilez[0] ? langDecoder(tilez[0].lang) : ""} 🔥 + {tilez[0] ? Math.floor(tilez[0].newListings / tilez[0].listings * 100)/100 : ""}% 📈
                  </div>
                  <div className="rotatingText">
                          Nr. 1 -> {tilez[0] ? langDecoder(tilez[0].lang) : ""} 🔥 + {tilez[0] ? Math.floor(tilez[0].newListings / tilez[0].listings * 100)/100 : ""}% 📈
                  </div>
              </h1>

          </header>
          <div className={`mainBody ${globHover ? "mainBodyHover" : ""}`}>
              <TileList tileData={tilez} />
          </div>
          <div className="ribbon"></div>
          <footer className="mainPageFooter">
              💸 best payed programming language
              📈 most popular programming language
          </footer>
            </div>
      </div>
  );
}
function TopLeftTriangle(size, mainColor, opaqueColor) {
    // const facadeTriangle = mainPage.Shape({ type: "triangle", size: size, color: mainColor });
    const OpaqueTriangle = ({ size, opaqueColor, onMouseEnter, onMouseLeave }) => {
        return (
            <Shape
                type="triangle"
                size={size + (1 / 3) * size}
                color={opaqueColor}
                opacity="0.5"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        );
    };
    const MainTriangle = ({ size, opaqueColor, onMouseEnter, onMouseLeave }) => {
        return (
            <Shape
                type="triangle"
                size={size}
                color={opaqueColor}
                opacity="1"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        );
    };

    const [isHovering, setIsHovering] = useState(false);

    const onMouseEnterHandler = () =>{
        globHover = true ;
        setIsHovering(true);
    }
    const onMouseLeaveHandler = () =>{
        globHover = false ;
        setIsHovering(false);
    }
    const mainTriangleClickHandler = () =>{
        const firstDropDownElement = document.querySelector('.dropDown-element');
        if (firstDropDownElement) {
            firstDropDownElement.click();
        }
    }

    return (
        <div className="triangleContainer">
            <div className="mainTriangle" onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
                <MainTriangle
                    size={size}  // Example size
                    opaqueColor={mainColor}  // Example color
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                    onMouseClick={mainTriangleClickHandler}
                />
            </div>
            <div className="opaqueTriangle" onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
                <OpaqueTriangle
                    size={size}  // Example size
                    opaqueColor={mainColor}  // Example color
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                />
                <div className="dropDown-content">
                    <div className="dropDown-element" onClick={handleDropDownClick} onMouseLeave={onMouseLeaveHandler2}> element </div>
                    <div className="dropDown-element" onClick={handleDropDownClick} onMouseLeave={onMouseLeaveHandler2}> element </div>
                        <div className="ddElement-option">option1</div>
                        <div className="ddElement-option">option2</div>
                        <div className="ddElement-option">option3</div>
                    <div className="dropDown-element" onClick={handleDropDownClick} onMouseLeave={onMouseLeaveHandler2}> element </div>
                </div>
            </div>
        </div>
    );
}
function handleDropDownClick(event) {
    if (!event.target.classList.contains('clicked')) {
        event.target.classList.toggle('clicked');
    }
}
function onMouseLeaveHandler2(event) {
    if (event.target.classList.contains('clicked')) {
        event.target.classList.toggle('clicked');
    }
}
export function TileList({ tileData }) {
    const [sortedData, setSortedData] = useState([]);

    // Sort the tile data whenever it changes
    useEffect(() => {
        const sorted = [...tileData].sort((a, b) => b.rankingCoef - a.rankingCoef);
        setSortedData(sorted);
    }, [tileData]);

    return (
        <div className={`tile-list ${globHover ? "tile-listHover" : ""}`}>
            {sortedData.map((tile, index) => (
                <Tile key={index} placing={index + 1} lang={tile.lang}
                      listings={tile.listings} rankingCoef={tile.rankingCoef}
                      newListings={tile.newListings} avgSalary={tile.avgSalary}/>
            ))}
        </div>
    );
}
export function Tile({placing, avgSalary, lang, listings, newListings}){
    const styles = {
        animationDelay: `${placing * 100}ms`,
    }
    console.log(styles.animationDelay) ;
    if((lang <= 0 || lang > 18) && 1) { /// change 0 to 1 if you want to NOT display Others as a language
        return (<div></div>);
    }
    else {
        return (
            <div className="tile" style={styles}>
                <div className="tilePlacing">
                    {placing}
                </div>
                <span className="tileLang">{langDecoder(lang)}</span>
                <span style={{ visibility: avgSalary === avgSalaryMax ? "visible" : "hidden", fontSize: 35, padding: 20 }}>💸</span>
                <span style={{ visibility: listings === listingsMax ? "visible" : "hidden", fontSize: 35, padding: 20}}>📈</span>
                <span className="slash">/</span>
                <span className="tileRight">{avgSalary} €</span>
                <span className="slash">/</span>
                <span className="tileRight">{listings} listings</span>
                <span className="slash">/</span>
                <span className="tileRight">{newListings} this week</span>
            </div>
        )
    }
}

function langDecoder(langCode){
    let langName;
    switch (langCode) {
        case 1:
            langName = "Java";
            break;
        case 2:
            langName = "JavaScript";
            break;
        case 3:
            langName = "Python";
            break;
        case 4:
            langName = "C++/C";
            break;
        case 5:
            langName = "Kotlin";
            break;
        case 6:
            langName = "C#";
            break;
        case 7:
            langName = "Swift";
            break;
        case 8:
            langName = "php";
            break;
        case 9:
            langName = "ruby";
            break;
        case 10:
            langName = "sql";
            break;
        case 11:
            langName = "html";
            break;
        case 12:
            langName = "r";
            break;
        case 13:
            langName = "go";
            break;
        case 14:
            langName = "rust";
            break;
        case 15:
            langName = "scala";
            break;
        case 16:
            langName = "dart";
            break;
        case 17:
            langName = "matlab";
            break;
        case 18:
            langName = "cobol";
            break;
        default:
            langName = "Others/Unmapped by App.js";
    }
    return <span>{langName}</span>;
}
export default App;
