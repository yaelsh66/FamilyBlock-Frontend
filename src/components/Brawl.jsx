import { useState, useEffect } from "react";
import './Brawl.css';
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';

function Brawl() {

  const categoryNamesHe = {
    Start: 'התחלה',
    Rare: 'נדיר',
    SuperRare: 'נדיר במיוחד',
    Epik: 'אדיר',
    Mitik: 'מדהים',
    Lagendery: 'אגדי',
    UltraLagendery: 'אולטרה אגדי'
  };

  const brawlTable = {
    Start: [
      { name: 'שלי', otherNames: [] },
    ],
    Rare: [
      { name: 'ניטה', otherNames: ['Nita'] },
      { name: 'קולט', otherNames: [] },
      { name: 'בול', otherNames: [] },
      { name: 'ברוק', otherNames: [] },
      { name: 'אל פרימו', otherNames: [] },
      { name: 'בארלי', otherNames: [] },
      { name: 'פוקו', otherNames: [] },
      { name: 'רוזה', otherNames: [] },
     
    ],
    SuperRare: [
      { name: 'גסי', otherNames: [] },
      { name: 'דינמייק', otherNames: [] },
      { name: 'טיק', otherNames: [] },
      { name: '8ביט', otherNames: [] },
      { name: 'ריקו', otherNames: [] },
      { name: 'דאריל', otherNames: [] },
      { name: 'פני', otherNames: [] },
      { name: 'קארל', otherNames: [] },
      { name: 'גקי', otherNames: [] },
      { name: 'גאס', otherNames: [] },
    ],
    Epik: [
      { name: 'בו', otherNames: [] },
      { name: 'אמז', otherNames: ['emz'] },
      { name: 'סטו', otherNames: [] },
      { name: 'פאם', otherNames: [] },
      { name: 'פרנק', otherNames: [] },
      { name: 'פייפר', otherNames: [] },
      { name: 'באבל', otherNames: ['ביבי'] },
      { name: 'בי', otherNames: [] },
      { name: 'נאני', otherNames: [] },
      { name: 'אדגר', otherNames: [] },
      { name: 'גריף', otherNames: [] },
      { name: 'גרום', otherNames: [] },
      { name: 'בוני', otherNames: [] },
      { name: 'גייל', otherNames: [] },
      { name: 'סופיה', otherNames: [] },
      { name: 'בל', otherNames: [] },
      { name: 'אש', otherNames: [] },
      { name: 'לולה', otherNames: [] },
      { name: 'סאם', otherNames: [] },
      { name: 'מנדי', otherNames: [] },
      { name: 'מייזי', otherNames: [] },
      { name: 'האנק', otherNames: [] },
      { name: 'פרל', otherNames: [] },
      { name: 'לארי ולורי', otherNames: [] },
      { name: 'אנגלו', otherNames: [] },
      { name: 'ברי', otherNames: [] },
      { name: 'שייד', otherNames: ['צל'] },
      { name: 'מיפל', otherNames: [] },
      { name: 'תראנקס', otherNames: ['להעמיס'] },
    ],
    Mitik: [
      { name: 'מורטיס', otherNames: [] },
      { name: 'טרה', otherNames: [] },
      { name: 'מקס', otherNames: [] },
      { name: 'מר פי', otherNames: ['מר P', 'מר p'] },
      { name: 'ספראוט', otherNames: [] },
      { name: 'ביירון', otherNames: [] },
      { name: 'סקוויק', otherNames: [] },
      { name: 'לו', otherNames: [] },
      { name: 'באז', otherNames: [] },
      { name: 'פאנג', otherNames: [] },
      { name: 'איב', otherNames: [] },
      { name: 'גנט', otherNames: [] },
      { name: 'באסטר', otherNames: [] },
      { name: 'אר טי', otherNames: ['R T'] },
      { name: 'וילו', otherNames: [] },
      { name: 'דאג', otherNames: [] },
      { name: 'צאק', otherNames: [] },
      { name: 'מיקו', otherNames: [] },
      { name: 'לילי', otherNames: [] },
      { name: 'קלנסי', otherNames: [] },
      { name: 'מו', otherNames: [] },
      { name: 'אולי', otherNames: [] },
      { name: 'לומי', otherNames: [] },
      { name: 'אלי', otherNames: [] },
      { name: 'מינה', otherNames: [] },
      { name: 'גין', otherNames: [] },
      { name: 'ראפס', otherNames: [] },
      { name: 'אוטיס', otherNames: [] },
      { name: 'גריי', otherNames: [] },
      { name: 'צארלי', otherNames: [] },
      { name: 'מלודי', otherNames: [] },
      { name: 'גוגו', otherNames: [] },
      { name: 'פינקס', otherNames: [] },
      { name: 'גיי יונג', otherNames: [] },
    ],
    Lagendery: [
      { name: 'ספייק', otherNames: [] },
      { name: 'קרואו', otherNames: [] },
      { name: 'לאון', otherNames: [] },
      { name: 'אמבר', otherNames: [] },
      { name: 'סרג', otherNames: [] },
      { name: 'צאסטר', otherNames: [] },
      { name: 'קנגי', otherNames: [] },
      { name: 'מג', otherNames: [] },
      { name: 'קורדיליוס', otherNames: [] },
      { name: 'קיט', otherNames: [] },
      { name: 'דראקו', otherNames: [] },
      { name: 'סנדי', otherNames: [] },
    ],
    UltraLagendery: [
      { name: 'קייז', otherNames: [] }
    ]
  };

  const [userInput, setUserInput] = useState('');
  const [currentTable, setCurrentTable] = useState({
    Start: [],
    Rare: [],
    SuperRare: [],
    Epik: [],
    Mitik: [],
    Lagendery: [],
    UltraLagendery: []

  });
  const [availableCategories, setAvailableCategories] = useState(brawlTable);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleAddItem = () => {
    const userItem = userInput.toLowerCase();
    const tableToAdd = { ...currentTable };
    const tableToDelete = { ...availableCategories };
    let done = false;

    for (let category in tableToDelete) {
      for (let i = 0; i < tableToDelete[category].length; i++) {
        const item = tableToDelete[category][i];
        if (item.name === userItem || item.otherNames.some(name => name.toLowerCase().includes(userItem))) {
          tableToDelete[category].splice(i, 1);
          tableToAdd[category] = [...tableToAdd[category], item.name];
          done = true;
          break;
        }
      }
      if (done) break;
    }

    setCurrentTable(tableToAdd);
    setAvailableCategories(tableToDelete);
    setUserInput('');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setUserInput('');
    setAvailableCategories(brawlTable);
    setCurrentTable({ Start: [],
    Rare: [],
    SuperRare: [],
    Epik: [],
    Mitik: [],
    Lagendery: [],
    UltraLagendery: [] });
  };

  const handleStart = () => {
    handleReset();
    setIsRunning(true);
  };

  const handleGiveUp = () => {
    if(isRunning){
      setIsRunning(false);
      
      const resultTable = { ...currentTable};
      for( let category in availableCategories){
        for( let i=0 ; i < availableCategories[category].length ; i++){
          let item = availableCategories[category][i];
          resultTable[category] = [ ...resultTable[category], item.name ];
        }
        
      }
      setCurrentTable(resultTable);
    }
  };

  return (
    <div className="brawl-wrapper container text-center my-5">
      <h1 className="mb-4">בראוול סטארס - נחשו את כל הבראולרים</h1>

      <div className="mb-3 d-flex flex-wrap justify-content-center gap-2">
        <Button variant="primary" onClick={handleStart}>התחל</Button>
        
        <Button variant="secondary" onClick={handleReset}>איפוס</Button>
        <Button variant="danger" onClick={handleGiveUp}>ויתרתי</Button>
      </div>

      <h4 className="mb-4">⏱ זמן: {Math.floor(time/60)}:{String(time%60).padStart(2, 0)} שניות</h4>
      { isRunning &&
      <InputGroup className="mb-4 w-100 w-md-50 mx-auto">
        <FormControl
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="הכנס בראוולר"
        />
        <Button variant="success" onClick={handleAddItem}>הוסף</Button>
      </InputGroup>
      }
      <div className="category-container">
        {Object.keys(currentTable).map((category) => {
          const totalItems = brawlTable[category].length;
          const filledItems = currentTable[category];
          const emptySlots = totalItems - filledItems.length;

          return (
            <div className={`category-column ${category.toLowerCase()}`} key={category}>
              <h5 className="mb-3">{categoryNamesHe[category] || category} ({filledItems.length}/{totalItems})</h5>
              <ul className="category-list">
                {filledItems.map((item, index) => (
                  <li className="category-item" key={`filled-${index}`}>
                    {item}
                  </li>
                ))}
                {[...Array(emptySlots)].map((_, i) => (
                  <li className="category-item empty" key={`empty-${i}`} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Brawl;
