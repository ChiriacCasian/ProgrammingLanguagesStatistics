import './map.css';
import './Style.css';
import {Shape} from "./MainPageComponents";
import 'animate.css';
import axios from "axios"
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import L, {geoJson, GeoJSON} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, {useEffect, useRef, useState} from "react";
import { ReactComponent as NetherlandsMap } from './Provinces_of_the_Netherlands.svg';
import {globHover} from "./App";

export default function MixedMap() {

    const [province, setProvinces] = useState([]);
    const [langs, setLangs] = useState([]);
    const [showCriteria, setShowCriteria] = useState(1); /// default show salaries
    const [langCriteria, setLangCriteria] = useState(0); /// 0 means no particular lang
    const [hoveredProvince, setClickedProvince] = useState(""); /// 0 means no particular lang

    useEffect(() => {
        axios.get('http://localhost:3030/getProvinces')
            .then(response => {
                setProvinces([...response.data]);
            })
            .catch(error => {
                console.error("There was an error with /getProvinces!", error);
            });
    }, []);
    useEffect(() => {
        axios.get('http://localhost:3030/getTiles') /// using Tiles because they are smaller and easier to work with
            .then(response => {
                setLangs([...response.data]);
            })
            .catch(error => {
                console.error("There was an error with /getTiles!", error);
            });
    }, []);

    useEffect(() => {
        const handleGroupHover = (event) => {
            let target = event.target;
            while (target && target.tagName !== 'g') {
                target = target.parentElement;
            }
            if (target) {
                target.classList.add('hovered');
                target.onmouseleave = () => {
                    target.classList.remove('hovered');
                };
            }
        };
        const handleGroupClick = (event) => {
            let target = event.target;
            while (target && target.tagName !== 'g') {
                target = target.parentElement;
            }
            if (target) {
                if (!target.classList.contains('clicked2')) {
                    document.querySelectorAll('.clicked2').forEach(element => {
                        element.classList.remove('clicked2');
                    });
                    setClickedProvince(target.id);
                    target.classList.add('clicked2');
                    document.querySelector('.provinceInfo').style.visibility = 'visible';
                }
            }
        };

        // Add event listeners to all <g> elements
        const groups = document.querySelectorAll('g');
        groups.forEach(group => {
            group.addEventListener('mouseover', handleGroupHover);
            group.addEventListener('click', handleGroupClick);
        });
        const maxAvgSalary = Math.max(...province.map(x => x.avgSalary)) ;
        const minAvgSalary = Math.min(...province.map(x => x.avgSalary).filter(x => x !== 0)) ;
        const maxListings = Math.max(...province.map(x => x.listings).filter(x => x !== 0)) ;
        const minListings = Math.min(...province.map(x => x.listings)) ;

        const maxAvgSalaryByLang = Math.max(...province.map(x => x.avgSalaryByLang[langCriteria])) ;
        const minAvgSalaryByLang = Math.min(...province.map(x => x.avgSalaryByLang[langCriteria]).filter(x => x !== 0)) ;
        const maxListingsByLang = Math.max(...province.map(x => x.listingsByLang[langCriteria]).filter(x => x !== 0)) ;
        const minListingsByLang = Math.min(...province.map(x => x.listingsByLang[langCriteria])) ;

        const applyColorGradient = () => {
            province.forEach(prov => {
                const specificGroup = document.getElementById(prov.name);

                if (specificGroup) {
                    if(langCriteria === 0) { /// no Lang Selected
                        if (showCriteria === 1) { /// salary
                            const style = colorGradient(prov.avgSalary, minAvgSalary, maxAvgSalary);
                            Object.assign(specificGroup.style, style);
                        } else if (showCriteria === 2) { /// listings
                            console.log(prov.listings);
                            const style = colorGradient(prov.listings, minListings, maxListings);
                            Object.assign(specificGroup.style, style);
                        }
                    }else {
                        if (showCriteria === 1) {
                            const style = colorGradient(prov.avgSalaryByLang[langCriteria], minAvgSalaryByLang, maxAvgSalaryByLang);
                            Object.assign(specificGroup.style, style);
                        } else if (showCriteria === 2) {
                            console.log(prov.listings);
                            const style = colorGradient(prov.listingsByLang[langCriteria], minListingsByLang, maxListingsByLang);
                            Object.assign(specificGroup.style, style);
                        }
                    }
                }
            });
        };

        applyColorGradient();

    }, [province, showCriteria, langCriteria]);

    function showSalary(event){
        setShowCriteria(1) ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clicked'));
        event.target.classList.add('clicked');
    }
    function showListings(event){
        setShowCriteria(2) ;
        const buttons = document.querySelectorAll('.sortButton');
        buttons.forEach(button => button.classList.remove('clicked'));
        event.target.classList.add('clicked');
    }
    function clickLangPickerTile(lang){
        setLangCriteria(lang);
    }

    const getLangName = (langCriteria) => {
        if (langCriteria === 0) return "all languages";
        const lang = langs.find(lang => lang.lang === langCriteria);
        return lang ? lang.name : "Unknown Lang";
    };
    function provinceInfoClickHandler() {
        document.querySelectorAll('.clicked2').forEach(element => {
            element.classList.remove('clicked2');
        });

        document.querySelector('.provinceInfo').style.visibility = 'hidden';
    }
    console.log(province)
    return (
        <div className={`tile-list ${globHover ? "tile-listHover" : ""}`} style={{ width:"100%", overflow:"hidden"}} >
            <NetherlandsMap className="map">
            </NetherlandsMap>
            <div className="provinceInfo" onClick={provinceInfoClickHandler}>
                {langCriteria === 0 ?
                    (province.filter(x => x.name === hoveredProvince).map(x => x.listings)[0] === 0 ? "no listings" :
                            <>
                                <span className="provinceInfoSpan">Province : {hoveredProvince}<br />
                                Selected Language : {getLangName(langCriteria)}</span>
                                <span className="provinceInfoSpan">Average Salary : {province.filter(x => x.name === hoveredProvince).map(x => x.avgSalary)}<br />
                                Job Listings : {province.filter(x => x.name === hoveredProvince).map(x => x.listings)}</span>
                            </>
                    )
                    :
                    (province.filter(x => x.name === hoveredProvince).map(x => x.listingsByLang[langCriteria])[0] === 0 ? "no listings" :
                            <>
                                <span className="provinceInfoSpan">Province : {hoveredProvince}<br />
                                Selected Language : {getLangName(langCriteria)}</span>
                                <span className="provinceInfoSpan">Average Salary : {province.filter(x => x.name === hoveredProvince).map(x => x.avgSalaryByLang[langCriteria])}<br />
                                Job Listings : {province.filter(x => x.name === hoveredProvince).map(x => x.listingsByLang[langCriteria])}</span>
                            </>
                    )
                }

            </div>

            <div className="salariesListingsDiv">

                <div style={{height:"100%", width:"100%", overflow:"hidden", borderRadius:"20px"}}>
                <button className={`salariesListingsButton ${showCriteria === 1 ? "clicked" : ""}`} onClick={showSalary}>salaries</button>
                <button className={`salariesListingsButton ${showCriteria === 2 ? "clicked" : ""}`} onClick={showListings}>listings</button>
                </div>

                <div className="langsButtonDiv">
                    <div className="langButton langButtonMain" style={{animation:"none", visibility:"visible", zIndex: 52}}>
                        {getLangName(langCriteria)}
                    </div>

                    <div key={0} className={`langButton ${langCriteria === 0 ? "clicked" : ""}`} style={{animationDelay: 0, zIndex: 51}} onClick={() => clickLangPickerTile(0)}>
                        all languages
                    </div>
                    {langs.filter((_, index) => index !==0).map((lang, index) => (
                        <div key={index} className={`langButton ${langCriteria === lang.lang ? "clicked" : ""}`} style={{animationDelay: `${(index + 1) * 0.035}s`, zIndex: 50 - index}} onClick={() => clickLangPickerTile(lang.lang)}>
                            {lang.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
const colorGradient = (val, min, max) => {
    const dif = max - min;
    val = val - min;
    const step = dif / 10;
    if (val < step) {
        return { fill: "#ff0000" }; // Red
    } else if (val < 2 * step) {
        return { fill: "#ff3300" }; // Orange-red
    } else if (val < 3 * step) {
        return { fill: "#ff6600" }; // Orange
    } else if (val < 4 * step) {
        return { fill: "#ff9900" }; // Yellow-orange
    } else if (val < 5 * step) {
        return { fill: "#ffcc00" }; // Yellow-green
    } else if (val < 6 * step) {
        return { fill: "#ffff00" }; // Yellow
    } else if (val < 7 * step) {
        return { fill: "#ccff00" }; // Yellow-green
    } else if (val < 8 * step) {
        return { fill: "#99ff00" }; // Yellow-green
    } else if (val < 9 * step) {
        return { fill: "#66ff00" }; // Yellow-green
    } else {
        return { fill: "#00ff50" }; // Green
    }
};