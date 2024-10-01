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

        // Add event listeners to all <g> elements
        const groups = document.querySelectorAll('g');
        groups.forEach(group => {
            group.addEventListener('mouseover', handleGroupHover);
        });

        // Cleanup event listeners on component unmount
        // return () => {
        //     groups.forEach(group => {
        //         group.removeEventListener('mouseout', handleGroupHover);
        //     });
        // };
    }, []);

    return (
        <div className={`tile-list ${globHover ? "tile-listHover" : ""}`}>
            <NetherlandsMap className="map" />
        </div>
    );
}