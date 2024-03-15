

let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'circle';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
  [0, 4, 8], [2, 4, 6], // diagonal
];


function init() {
  render();
}

function render() {
  let board = document.getElementById('divContainer');
  board.innerHTML = '';
  for (let i = 0; i < fields.length; i++) {
    board.innerHTML += `
        <div class = "cell" id="cell${i}" onclick="fillField(${i})"></div>`
  };
}

function gameAgain(){
  fields = [ null, null, null, null, null, null, null, null, null,];
render();
}

function fillField(i) {
  if (fields[i] === null) {
    fields[i] = currentPlayer;
    cell = document.getElementById('cell' + i);
    cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
    cell.onclick = null;  //es una proteccion.
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    // es lo mismo que este if =    
    /*    if (currentPlayer == 'circle'){
         currentPlayer = 'cross';
       }
       else{
         currentPlayer = 'circle';
       } */

    if (isGameFinished()) {
      const winCombination = getWinningCombination();
      if(winCombination != null){
        drawWinningLine(winCombination);
      }      
    }
  }
}

function isGameFinished() {
  return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
      return WINNING_COMBINATIONS[i];
    }
  }
  return null;
}


function generateCircleSVG() {
  const color = '#00B0EF';
  const width = 70;
  const height = 70;

  return `<svg width="${width}" height="${height}">
              <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="8" fill="none">
                <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
              </circle>
            </svg>`;
}


function generateCrossSVG() {
  const color = '#FFC000';
  const width = 70;
  const height = 70;

  const svgHtml = `
      <svg width="${width}" height="${height}">
        <line x1="0" y1="0" x2="${width}" y2="${height}"
          stroke="${color}" stroke-width="8">
          <animate attributeName="x2" values="0; ${width}" dur="200ms" />
          <animate attributeName="y2" values="0; ${height}" dur="200ms" />
        </line>
        <line x1="${width}" y1="0" x2="0" y2="${height}"
          stroke="${color}" stroke-width="8">
          <animate attributeName="x2" values="${width}; 0" dur="200ms" />
          <animate attributeName="y2" values="0; ${height}" dur="200ms" />
        </line>
      </svg>
    `;

  return svgHtml;
}

function drawWinningLine(combination) {
  const lineColor = 'green';
  const lineWidth = 5;

  const startCell = document.getElementById(`cell${combination[0]}`);
  const endCell = document.getElementById(`cell${combination[2]}`);
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();

  const lineLength = Math.sqrt(
    Math.pow(endRect.x - startRect.x, 2) + Math.pow(endRect.y - startRect.y, 2)
  );
  const lineAngle = Math.atan2(endRect.y - startRect.y, endRect.x - startRect.x);

  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.width = `${lineLength}px`;
  line.style.height = `${lineWidth}px`;
  line.style.backgroundColor = lineColor;
  line.style.top = `${startRect.y + startRect.height / 2}px`;
  line.style.left = `${startRect.x + startRect.width / 2}px`;
  line.style.transform = `rotate(${lineAngle}rad)`;
  line.style.transformOrigin = `top left`;
  document.getElementById('divContainer').appendChild(line);  
}

