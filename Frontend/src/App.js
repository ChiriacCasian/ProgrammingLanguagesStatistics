///import './App.css';
import './MainPageComponents';
import './Style.css';
import {Shape} from "./MainPageComponents";
import React, {useEffect, useRef, useState} from "react";
import 'animate.css';
import axios from "axios"

let globHover = false;
function App() {
    const tileData = [
        { lang: 10, valProp: 300 },
        { lang: 11, valProp: 200 },
        { lang: 12, valProp: 100 },
        { lang: 13, valProp: 10 },
        { lang: 14, valProp: 20 },
        { lang: 15, valProp: 500 },
        { lang: 16, valProp: 500 },
        { lang: 17, valProp: 500 },
        { lang: 18, valProp: 500 },
        { lang: 19, valProp: 500 },
        { lang: 20, valProp: 500 },
        { lang: 21, valProp: 500 },
        { lang: 22, valProp: 500 }
    ];

    const [tilez, setTilez] = useState([]);
    var erorz = "any eror" ;
    useEffect(() => {
        axios.get('/get/getTiles')
            .then(response => {
                setTilez(response.data);
            })
            .catch(error => {
                erorz = "big error" ;
                console.error("There was an error fetching the tiles!", error);
            });
    }, []); /// there are no external dependencies that can trigger useEffect to rerun

    const [currentData, setTileData] = useState(tileData);

    const mainTriangleColor = getComputedStyle(document.documentElement).getPropertyValue('--4green').trim();
    const opaqueTriangleColor = getComputedStyle(document.documentElement).getPropertyValue('--4green').trim();
    const viewportWidth = window.innerWidth;

    return (
      <div className="mainDiv">
          {TopLeftTriangle( 18/100 * viewportWidth, mainTriangleColor, opaqueTriangleColor)}
            <div className={`blurArea ${globHover ? "blurAreaHover" : ""}`}>
          <header>
              <h1 className="titleHeader"><span className="offsetText"><div className="animateTitle"> 🔥</div></span></h1>
              <h1 className="rotatingTextDiv"><span className="rotatingText"> ----->> Make this text rotating ---->> </span></h1>
          </header>
          <div className={`mainBody ${globHover ? "mainBodyHover" : ""}`}>
              ce maaa ???
              {tilez.length}
              {erorz}
              {/*<button*/}
              {/*    onClick={() => {*/}
              {/*        const newTileData = [...currentData];*/}
              {/*        newTileData[1].valProp += 10;*/}
              {/*        setTileData(newTileData);*/}
              {/*    }}*/}
              {/*>*/}
              {/*    Click me!*/}
              {/*</button>*/}
              <TileList tileData={tilez} />
          </div>
          <div className="ribbon"></div>
          <footer className="mainPageFooter">
              This is the Footer.
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

    return (
        <div className="triangleContainer">
            <div className="mainTriangle" onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
                <MainTriangle
                    size={size}  // Example size
                    opaqueColor={mainColor}  // Example color
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
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
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                </div>
            </div>
        </div>
    );
}
export function TileList({ tileData }) {
    const [sortedData, setSortedData] = useState([]);

    // Sort the tile data whenever it changes
    useEffect(() => {
        const sorted = [...tileData].sort((a, b) => b.listings - a.listings);
        setSortedData(sorted);
    }, [tileData]);

    return (
        <div className={`tile-list ${globHover ? "tile-listHover" : ""}`}>
            {sortedData.map((tile, index) => (
                <Tile key={index} placing={index + 1} lang={tile.lang}
                      listings={tile.listings}/>
            ))}
        </div>
    );
}
export function Tile({placing, lang, listings}){
    return (
        <div className="tile">
            chart here and lang is {lang} and the place is {placing} and val is {listings}
        </div>
    )
}

export default App;
