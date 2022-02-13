let symbol = 'cross'

const winCombinations = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['1', '4', ' 7'],
  ['2', '5', '8'],
  ['3', '6', '9'],
  ['1', '5', '9'],
  ['3', '5', '7'],
]

const svg = {
  cross: `
  <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
    <line
      class="line first"
      y2="130"
      x2="130"
      y1="20"
      x1="20"
      stroke-width="10"
      stroke="#000"
      fill="none"
    />
    <line
      class="line second"
      y2="130"
      x2="20"
      y1="20"
      x1="130"
      stroke-width="10"
      stroke="#000"
      fill="none"
    />
    <style>
      .line {
        stroke-dasharray: 500;
        stroke-dashoffset: 500;
        animation: draw 0.5s linear forwards;
      }
      .line.second {
        animation-delay: 0.3s;
      }
      @keyframes draw {
        100% {
          stroke-dashoffset: 0;
        }
      }
    </style>
  </svg>
  `,
  circle: `
  <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
    <circle
      class="circle"
      stroke-width="10"
      r="60"
      cy="75"
      cx="75"
      stroke="#000"
      fill="none"
    />
    <style>
      .circle {
        stroke-dasharray: 500;
        stroke-dashoffset: 500;
        animation: draw 0.5s linear forwards;
      }
      @keyframes draw {
        100% {
          stroke-dashoffset: 0;
        }
      }
    </style>
  </svg>
  `,
}

const turns = {
  cross: '',
  circle: '',
}

const board = document.querySelector('.board')

function move(target) {
  target.innerHTML = svg[symbol]
  turns[symbol] += target.dataset.cell
  isWin() ? renderWin() : isDraw() ? renderDraw() : null
  symbol = symbol === 'cross' ? 'circle' : 'cross'
}

function isWin() {
  for (let i = 0; i < winCombinations.length; i++) {
    const result = winCombinations[i].every((cell) => {
      return turns[symbol].includes(cell)
    })
    if (result) {
      return result
    }
  }
}

function isDraw() {
  return turns.cross.length + turns.circle.length === 9
}

function renderWin() {
  console.log('win', symbol)
}

function renderDraw() {
  console.log('draw')
}

function renderBoard() {
  console.log('board')
}

board.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell')) {
    if (e.target.dataset.empty === 'true') {
      e.target.dataset.empty = 'false'
      move(e.target)
    }
  }
})
