import React, {useEffect, useState} from 'react';
import './Style.css';
export function mainPageTitle() {
    return (
        <div>
            <h1>Welcome to the main page!</h1>
        </div>
    )
}
export function shape({type, size, color, borderRadius, borderSize, borderColor, opacity}) {
    const styles = {
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: borderRadius,
        borderSize: borderSize,
        borderColor: borderColor,
        border: `${borderSize} solid ${borderColor}`,
        opacity: opacity
    }
    switch (type) {
        case "square":
            return <div style={styles}></div>;

         case "circle":
             styles.borderRadius = "50%";
             return <div style={styles}></div>;
        case "triangle":
            size = parseInt(size)
            return (
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderRight: `${size}px solid transparent`, // Use backticks
                        borderTop: `${size}px solid ${color}`, // Use backticks
                        opacity: opacity
                    }}
                ></div>
            );

        default:
            return null;
    }
}
export function Tile({lang, chart}){
    return (
        <div>
            <h2>{lang}</h2>
        </div>
    )
}
export function tileList({ tileData }) {
    const [sortedData, setSortedData] = useState([]);

    // Sort the tile data whenever it changes
    useEffect(() => {
        const sorted = [...tileData].sort((a, b) => b.value - a.value);
        setSortedData(sorted);
    }, [tileData]);

    return (
        <div className="tile-list">
            {sortedData.map((tile, index) => (
                <Tile key={index} chart={tile.chart} value={tile.lang} />
            ))}
        </div>
    );
}