import React, {useEffect, useState} from 'react';
import './Style.css';

export const Shape = ({ type, size, color, borderRadius, borderSize, borderColor, opacity }) => {
    const styles = {
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: borderRadius,
        borderSize: borderSize,
        borderColor: borderColor,
        border: `${borderSize} solid ${borderColor}`,
        opacity: opacity,
    };

    switch (type) {
        case "square":
            return <div style={styles}></div>;
        case "circle":
            styles.borderRadius = "50%";
            return <div style={styles}></div>;
        case "triangle":
            size = parseInt(size);
            return (
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderRight: `${size}px solid transparent`,
                        borderTop: `${size}px solid ${color}`,
                        opacity: opacity,
                    }}
                ></div>
            );
        default:
            return null;
    }
};