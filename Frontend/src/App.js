import logo from './logo.svg';
import './App.css';
import './MainPageComponents'
import * as mainPage from "./MainPageComponents";
import './Style.css';
import {shape} from "./MainPageComponents";
function App() {
    const circle = mainPage.shape({ type: "circle", size: '300px', color: "red", borderSize: '10px', borderColor: 'black'});
  return (
      <div className="mainPage">
          <header className="mainPageHeader">
            {topLeftTriangle()}
            {mainPage.mainPageTitle()}
          </header>
          <body className="mainBody">
            {circle}
          <ol>
              <li>{mainPage.mainPageLangTile({lang: "java"})}</li>
          </ol>
          </body>
          <footer className="mainPageFooter">
              This is the Footer.
          </footer>
      </div>
  );
}
function topLeftTriangle(){
    const mainTriangle = mainPage.shape({ type: "triangle", size: '300px', color: "blue"});
    const opaqueTriangle = mainPage.shape({ type: "triangle", size: '400px', color: "lightblue", opacity: '0.5'});
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
