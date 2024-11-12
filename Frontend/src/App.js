///import './App.css';
import './Style.css';
import {Shape} from "./MainPageComponents";
import React, {useEffect, useRef, useState} from "react";
import 'animate.css';
import axios from "axios"
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import MixedMap from './nlMap';
import { ReactComponent as nlSvgMap } from './svgs/Provinces_of_the_Netherlands.svg';
import { ReactComponent as deSvgMap } from './svgs/svgGermany.svg';
import { ReactComponent as usaSvgMap } from './svgs/svgUsa.svg';
import { ReactComponent as GermanySvgFlag } from './svgs/Flag_of_Germany.svg';
import { ReactComponent as UsaSvgFlag } from './svgs/Flag_of_the_US.svg';
import { ReactComponent as NetherlandsSvgFlag } from './svgs/Flag_of_the_Netherlands.svg';

export let globHover = false;
let avgSalaryMax = -1 ;
let listingsMax = -1 ;
const Api_Url = process.env.REACT_APP_API_URL;
const Web_Url = process.env.REACT_APP_WEB_URL;
function App() {
    const [tilez, setTilez] = useState([]);
    const [dataCountry, setDataCountry] = useState([""]) ;
    useEffect(() => {
        axios.get(`${Api_Url}/getTiles${dataCountry}`)
            .then(response => {
                setTilez([...response.data].sort((a, b) => b.rankingCoef - a.rankingCoef));
                console.log("getTiles")
            })
            .catch(error => {
                console.error("There was an error fetching the tiles!", error);
            });
    }, [dataCountry]);

    const mainTriangleColor = getComputedStyle(document.documentElement).getPropertyValue('--4green').trim();
    const opaqueTriangleColor = getComputedStyle(document.documentElement).getPropertyValue('--5green').trim();
    const viewportWidth = window.innerWidth;

    avgSalaryMax = Math.max(...tilez.map(x => x.avgSalary));
    listingsMax = Math.max(...tilez.map(x => x.listings));

    console.log(tilez) ;

    return (
        <Router>
            <div className="mainDiv">
                <Routes>
                    <Route path="/" element={TopLeftTriangle(18/100 * viewportWidth, mainTriangleColor, mainTriangleColor, opaqueTriangleColor)} />
                    <Route path="/usaMap" element={TopLeftTriangle(18/100 * viewportWidth, "blue", "white", "red")} />
                    <Route path="/nlMap" element={TopLeftTriangle(18/100 * viewportWidth, "red", "white", "blue")} />
                    <Route path="/deMap" element={TopLeftTriangle(18/100 * viewportWidth, "black", "red", "yellow")} />
                </Routes>
                <div className={`blurArea ${globHover ? "blurAreaHover" : ""}`}>

                    <Routes>
                        <Route path="/" element={
                            <header>
                                <h1 className="titleHeader"><span className="offsetText"><div className="animateTitle">Codemetrics</div></span></h1>
                                <h1 className="rotatingTextDiv">
                                    <div className="rotatingText">
                                        Nr. 1 -> {tilez[0] ? langDecoder(tilez[0].lang) : ""} 🔥 + {tilez[0] ? Math.floor(tilez[0].newListings / tilez[0].listings * 100)/100 : ""}% 📈
                                    </div>
                                    <div className="rotatingText">
                                        Nr. 1 -> {tilez[0] ? langDecoder(tilez[0].lang) : ""} 🔥 + {tilez[0] ? Math.floor(tilez[0].newListings / tilez[0].listings * 100)/100 : ""}% 📈
                                    </div>
                                </h1>
                            </header>
                        }/>
                        <Route path="/nlMap" element={<></>} />
                        <Route path="/deMap" element={<></>} />
                        <Route path="/usaMap" element={<></>} />
                    </Routes>
                    <div className={`mainBody ${globHover ? "mainBodyHover" : ""}`}>

                        <Routes>
                            <Route path="/nlMap" element={<MixedMap SvgMap={nlSvgMap} provincesEndpoint={`${Api_Url}/getProvinces`} tilesEndpoint={`${Api_Url}/getTiles`} />} />
                            <Route path="/deMap" element={<MixedMap SvgMap={deSvgMap} provincesEndpoint={`${Api_Url}/getProvincesGermany`} tilesEndpoint={`${Api_Url}/getTilesGermany`} />} />
                            <Route path="/usaMap" element={<MixedMap SvgMap={usaSvgMap} provincesEndpoint={`${Api_Url}/getProvincesUsa`} tilesEndpoint={`${Api_Url}/getTilesUsa`} />} />
                            <Route path="/" element={<TileList tileData={tilez} setDataCountry={setDataCountry} />} />
                        </Routes>

                    </div>
                    <footer className="mainPageFooter">
                        <a href={`${Web_Url}/privacy`}>privacy policy</a>
                        <a href={`${Web_Url}/contact`}>contact</a>
                        <span>overall : sorting coefficient is calculated as 60% average salary and 40% availability as in relative number of listings</span>
                        <span>rotating title : the language with the biggest weekly increase in live listings</span>
                    </footer>
                </div>
            </div>
        </Router>
    );
}
function TopLeftTriangle(size, auxColor, mainColor, opaqueColor) {
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
            <div className="auxTriangle" onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
                <MainTriangle
                    size={size * 0.7}  // Example size
                    opaqueColor={auxColor}  // Example color
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                    onMouseClick={mainTriangleClickHandler}
                />
            </div>
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
                    opaqueColor={opaqueColor}  // Example color
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                />
                <div className="dropDown-content">
                    <a href={`${Web_Url}`} style={{textDecoration: 'none', color: "black"}}>
                        <div className="dropDown-element">
                            <span className="ddInitialText">HOME</span>
                        </div>
                    </a>
                    <div className="dropDown-element" onClick={handleDropDownClick} onMouseLeave={onMouseLeaveHandler2}>
                        <span className="ddInitialText">MAP</span>
                        <a href={`${Web_Url}/usaMap`} className="ddElement-option" style={{animationDelay: '0ms', height: '33.33%'}}>Usa</a>
                        <a href={`${Web_Url}/nlMap`} className="ddElement-option" style={{animationDelay: '200ms', height: '33.33%'}}>Netherlands</a>
                        <a href={`${Web_Url}/deMap`} className="ddElement-option" style={{animationDelay: '400ms', height: '33.33%'}}>Germany</a>
                    </div>
                    <div className="dropDown-element" onClick={handleDropDownClick} onMouseLeave={onMouseLeaveHandler2}>
                        <span className="ddInitialText">☰</span>
                        <div className="ddElement-option" style={{animationDelay: '0ms', height: '25%'}}>option1</div>
                        <div className="ddElement-option" style={{animationDelay: '200ms', height: '25%'}}>option2</div>
                        <div className="ddElement-option" style={{animationDelay: '400ms', height: '25%'}}>option3</div>
                        <div className="ddElement-option" style={{animationDelay: '600ms', height: '25%'}}>option3</div>
                    </div>
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
function onMouseLeaveHandler2(event) { /// if it s clicked unclick it
    if (event.target.classList.contains('clicked')) {
        event.target.classList.toggle('clicked');
    }
}
export function TileList({ tileData, setDataCountry }) {
    const [sortedData, setSortedData] = useState([]);
    const [sortCriteria, setSortCriteria] = useState(3); /// default sort by rankingCoef
    // Sort the tile data whenever it changes
    useEffect(() => {
        if(sortCriteria === 1) {
            const sorted = [...tileData].sort((a, b) => b.avgSalary - a.avgSalary);
            setSortedData(sorted);
            const buttons = document.querySelectorAll('.sortButton');
            buttons.forEach(button => button.classList.remove('clicked'));
            buttons[0].classList.add('clicked');
        }else if(sortCriteria === 2){
            const sorted = [...tileData].sort((a, b) => b.listings - a.listings);
            setSortedData(sorted);
            const buttons = document.querySelectorAll('.sortButton');
            buttons.forEach(button => button.classList.remove('clicked'));
            buttons[1].classList.add('clicked');
        }else if(sortCriteria === 3){
            const sorted = [...tileData].sort((a, b) => b.rankingCoef - a.rankingCoef);
            setSortedData(sorted);
            const buttons = document.querySelectorAll('.sortButton');
            buttons.forEach(button => button.classList.remove('clicked'));
            buttons[2].classList.add('clicked');
        }
        const buttons = document.querySelectorAll('.sortButton');
        let buttonsClicked = 0;
        for (const button of buttons) {
            buttonsClicked += button.classList.contains('clickedMap') ? 1 : 0;
        }
        if (buttonsClicked === 0) {
            buttons[5].classList.add('clickedMap');
        }
    }, [tileData, sortCriteria]);

    function sortBySalary(event){
        setSortCriteria(1) ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clicked'));
        event.target.classList.add('clicked');
    }
    function sortByListings(event){
        setSortCriteria(2) ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clicked'));
        event.target.classList.add('clicked');
    }
    function sortByAllMetrics(event){
        setSortCriteria(3) ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clicked'));
        event.target.classList.add('clicked');
    }

    function setCountryDataUsa(event){
        setDataCountry("Usa") ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clickedMap'));
        event.target.classList.add('clickedMap');
    }
    function setCountryDataDe(event){
        setDataCountry("Germany") ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clickedMap'));
        event.target.classList.add('clickedMap');
    }
    function setCountryDataNl(event){
        setDataCountry("") ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clickedMap'));
        event.target.classList.add('clickedMap');
    }
    return (
        <div className={`tile-list ${globHover ? "tile-listHover" : ""}`}>
            {sortedData.map((tile, index) => (
                <Tile key={tile.id} placing={index + 1} lang={tile.lang}
                      listings={tile.listings} rankingCoef={tile.rankingCoef}
                      newListings={tile.newListings} avgSalary={tile.avgSalary}/>
            ))}
            <div className="sortButtonsDiv">
                <button className="sortButton" onClick={sortBySalary}>salary</button>
                <button className="sortButton" onClick={sortByListings}>listings</button>
                <button className="sortButton" onClick={sortByAllMetrics}>overall</button>
            </div>
            <div id="countriesSortButtonDiv" className="sortButtonsDiv">
                <button className="sortButton" onClick={setCountryDataUsa}><UsaSvgFlag style={{width: "80%", pointerEvents: "none"  }} /></button>
                <button className="sortButton" onClick={setCountryDataDe}><GermanySvgFlag style={{width: "80%", pointerEvents: "none"  }} /></button>
                <button className="sortButton" onClick={setCountryDataNl}><NetherlandsSvgFlag style={{width: "80%", pointerEvents: "none" }} /></button>
            </div>
        </div>
    );
}
export function Tile({placing, avgSalary, lang, listings, newListings}){
    const styles = {
        animationDelay: `${placing * 100}ms`,
    }
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