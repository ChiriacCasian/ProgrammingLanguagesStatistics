import logo from './logo.svg';
import './App.css';
import './MainPageComponents'
import * as mainPage from "./MainPageComponents";
import './Style.css';
import {shape, TileList} from "./MainPageComponents";
import {useEffect, useRef, useState} from "react";
function App() {
    const circle = mainPage.shape({ type: "circle", size: '300px', color: "red", borderSize: '10px', borderColor: 'black'});
    const tileData = [
        { lang: 10, valProp: 300 },
        { lang: 11, valProp: 200 },
        { lang: 12, valProp: 100 },
        { lang: 13, valProp: 10 },
        { lang: 14, valProp: 20 },
        { lang: 15, valProp: 500 }
    ];
    const [currentData, setTileData] = useState(tileData);

    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    useEffect(() => {
        if(headerRef.current){
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [])
  return (
      <div className="mainPage">
          <header className="mainPageHeader" ref ={headerRef}>
              {topLeftTriangle(headerRef.current?.offsetHeight)}
              {mainPage.mainPageTitle()}
          </header>
          <div className="ribbon"></div>
          <div className="mainBody">
              {circle}

              <button
                  onClick={() => {
                      const newTileData = [...currentData];
                      newTileData[1].valProp += 10;
                      setTileData(newTileData);
                  }}
              >
                  Click me!
              </button>
              <TileList tileData={currentData} />
          </div>
          <div className="ribbon"></div>
          <footer className="mainPageFooter">
              This is the Footer.
          </footer>
      </div>

  );
}
function topLeftTriangle(size){
    const mainTriangle = mainPage.shape({ type: "triangle", size: size, color: "blue"});
    const opaqueTriangle = mainPage.shape({ type: "triangle", size: size + 1/3 * size, color: "lightblue", opacity: '0.5'});
    return (
    <div style={{position: 'relative'}}>
        {mainTriangle}

        <div style={{position: 'absolute', top: '0', left: '0'}}>
            {opaqueTriangle}
        </div>
    </div>
    )
}

export default App;
