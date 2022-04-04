let globalLoc = 0;     // Line of code, money in the game.

/* Const Arrays */
let hireNames = ["Programmer", "Software Engineer", "Coding AI"];
let hirePrices = [50, 500, 2000];
let hireUnitProduces = [5, 60, 400];      // Produce per sec

/* Variable Arrays */
let hireNumbers = [0, 0, 0];
let hireTotalProduces = [0, 0, 0];

/* Mechanism */

function getLiById(i){
    let className = "." + hireNames[i].toLowerCase().replace(" ", "_")
    return document.querySelector(className);
}

function produceLocByClick(e){
    let inc =  Math.floor(Math.random() * 10) + 1;
    globalLoc += inc;
    updateLocDisplay();
    showLocIncrease(e, inc);
}

function produceLocByHire(){
    for(let i = 0; i < hireNames.length; i++){
        globalLoc += hireTotalProduces[i];
    }
    updateLocDisplay();
}

function hireByIndex(i){
    if(globalLoc < hirePrices[i]) return;
    globalLoc -= hirePrices[i];
    hireNumbers[i] ++;
    hireTotalProduces[i] = hireNumbers[i] * hireUnitProduces[i];
    updateHireDisplay(i);
    updateLocDisplay();
}

function initHireButtonListeners(){
    for (let i = 0; i < hireNames.length; i++){
        const li = getLiById(i);
        const button = li.querySelector(".hire_button");
        button.addEventListener('click', function(){
            hireByIndex(i);
        })
    }
}

/* Display */

function checkHireAvailable(){
    for(let i = 0; i < hireNames.length; i++){
        let elem = getLiById(i);
        let money = hirePrices[i];
        if (globalLoc.display != "block" && globalLoc >= money){
            updateHireDisplay(i);
            elem.style.display = "block";
        }
    }
}

function updateLocDisplay(){
    const status = document.querySelector(".status");
    status.textContent = globalLoc + "  Lines of code";

    /* Disable and enable buttons */
    for(let i = 0; i < hireNames.length; i++){
        const btn = getLiById(i).querySelector(".hire_button");
        if(globalLoc >= hirePrices[i]) btn.disabled = false;
        else btn.disabled = true;
    }
}

function updateHireDisplay(i){
    const li = getLiById(i);
    const workerNumber = li.querySelector(".worker_number");
    const incomePerSec = li.querySelector(".income_per_second");
    const button = li.querySelector(".hire_button");
    workerNumber.textContent = "* " + hireNumbers[i];
    incomePerSec.textContent = hireTotalProduces[i] + " LOC/s";
    button.textContent = "Hire";
    button.appendChild(document.createElement("br"));
    button.appendChild(document.createTextNode("-" + hirePrices[i] + " LOC"));
    hirePrices[i];
}

/* If you get n Loc by clicking the computer, display +n on cursor */
function showLocIncrease(e, n){
    const locInc = document.querySelector(".loc_increase");
    locInc.textContent = ("+ " + n);
    locInc.style.display = "block";
    locInc.style.color = getRandomColor();
    locInc.style.fontSize = (1 + n/4) + "em";
    locInc.style.left = e.clientX + "px";
    locInc.style.top = e.clientY + "px";
}

function getRandomColor(){
    let i = Math.floor(Math.random() * 360);
    return "hsl("+i+",100%,50%)";
}

initHireButtonListeners();
const computerImg = document.querySelector(".computer_img");
computerImg.addEventListener('click', produceLocByClick);
setInterval(checkHireAvailable, 1000);
setInterval(produceLocByHire, 1000);