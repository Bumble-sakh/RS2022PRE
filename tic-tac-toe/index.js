let symbol = 'cross'
let startGame = 0
let endGame = {}
let isEnd = false
let score = localStorage.score ? JSON.parse(localStorage.score) : []

const music = new Audio('sounds/music.mp3')
music.volume = 0.1
music.loop = true

const clickSnd = new Audio('sounds/click.mp3')
const moveSnd = new Audio('sounds/move.mp3')

const winCombinations = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['1', '4', '7'],
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

const main = document.querySelector('.game__main')
const backBtn = document.querySelector('.back-btn')
const muteBtn = document.querySelector('.mute-btn ')

function initGame() {
  symbol = 'cross'
  endGame = {}
  isEnd = false
  turns.cross = ''
  turns.circle = ''
  renderBoard()
  startGame = Date.now()
  setTimeout(timer, 500)
  music.play()
}

function move(target) {
  target.innerHTML = svg[symbol]
  turns[symbol] += target.dataset.cell
  isWin() ? renderResult('win') : isDraw() ? renderResult('draw') : null
  moveSnd.play()
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

function renderResult(result) {
  isEnd = true
  const turn = turns.cross.length + turns.circle.length
  const gameResult = [result, result === 'draw' ? '' : symbol, turn, endGame]
  score.unshift(gameResult)
  score.length = score.length > 10 ? 10 : score.length
  localStorage.setItem('score', JSON.stringify(score))

  const resultBlock = `
  <div class="result">
    <div class="result__title">${
      (result === 'draw' ? '' : symbol, result)
    }</div>
    <div class="result__turns">${turn} turns</div>
    <div class="result__table">
      <table>
        <th>
          <td>Result</td>
          <td>Turns</td>
          <td>Time</td>
        </th>
        ${renderScore()}
      </table>
    </div>
    <div class="result__restart-btn">
      <button class="restart-btn">Try again</button>
    </div>
  </div>
  `

  clearMain()
  main.insertAdjacentHTML('afterbegin', resultBlock)
}

function renderScore() {
  let rows = ''
  for (let i = 0; i < score.length; i++) {
    rows += `<tr>
              <td>${score[i][0]} ${score[i][1]}</td>
              <td>${score[i][2]}</td>
              <td>${score[i][3].min}:${score[i][3].sec}</td>
            </tr>`
  }
  return rows
}

function renderBoard() {
  const board = `
  <div class="board">
    <div class="grid">
      <svg width="470" height="470" xmlns="http://www.w3.org/2000/svg">
        <line
          class="line first"
          y2="470"
          x2="155"
          y1="0"
          x1="155"
          stroke-width="10"
          stroke="#000"
          fill="none"
        />
        <line
          class="line second"
          y2="470"
          x2="315"
          y1="0"
          x1="315"
          stroke-width="10"
          stroke="#000"
          fill="none"
        />
        <line
          class="line third"
          y2="155"
          x2="470"
          y1="155"
          x1="0"
          stroke-width="10"
          stroke="#000"
          fill="none"
        />
        <line
          class="line fourth"
          y2="315"
          x2="470"
          y1="315"
          x1="0"
          stroke-width="10"
          stroke="#000"
          fill="none"
        />
        <style>
          .line {
            stroke-dasharray: 500;
            stroke-dashoffset: 500;
            animation: draw 0.5s linear forwards;
            animation-iteration-count: 1;
          }
          .line.second {
            animation-delay: 0.3s;
          }

          .line.third {
            animation-delay: 0.6s;
          }

          .line.fourth {
            animation-delay: 0.9s;
          }
          @keyframes draw {
            100% {
              stroke-dashoffset: 0;
            }
          }
        </style>
      </svg>
    </div>
    <div class="cell" data-empty="true" data-cell="1"></div>
    <div class="cell" data-empty="true" data-cell="2"></div>
    <div class="cell" data-empty="true" data-cell="3"></div>
    <div class="cell" data-empty="true" data-cell="4"></div>
    <div class="cell" data-empty="true" data-cell="5"></div>
    <div class="cell" data-empty="true" data-cell="6"></div>
    <div class="cell" data-empty="true" data-cell="7"></div>
    <div class="cell" data-empty="true" data-cell="8"></div>
    <div class="cell" data-empty="true" data-cell="9"></div>
  </div>
  `
  clearMain()
  main.insertAdjacentHTML('afterbegin', board)
}

function renderStart() {
  const start = `
  <button class="start-btn btn">Start</button>
  `
  clearMain()
  main.insertAdjacentHTML('afterbegin', start)

  music.pause()
  music.currentTime = 0

  const startBtn = document.querySelector('.start-btn')
  startBtn.addEventListener('click', (e) => {
    clickSnd.play()
    initGame()
  })
}

function clearMain() {
  main.innerHTML = ''
}

function timer() {
  const time = document.querySelector('.time')
  const passed = Math.floor((Date.now() - startGame) / 1000)
  const min = Math.trunc(passed / 60)
    .toString()
    .padStart(2, '0')
  const sec = (passed % 60).toString().padStart(2, '0')
  time.textContent = `${min}:${sec}`
  endGame = { min: min, sec: sec }
  if (isEnd) {
    return (endGame = { min: min, sec: sec })
  }
  setTimeout(timer, 100)
}

/* listeners */

main.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell')) {
    if (e.target.dataset.empty === 'true') {
      e.target.dataset.empty = 'false'
      move(e.target)
    }
  }
  if (e.target.classList.contains('restart-btn')) {
    clickSnd.play()
    initGame()
  }
})

backBtn.addEventListener('click', (e) => {
  clickSnd.play()
  renderStart()
})

muteBtn.addEventListener('click', () => {
  clickSnd.play()
  music.muted = !music.muted
  muteBtn.textContent = muteBtn.textContent === 'Mute' ? 'Unmute' : 'Mute'
})

/* init */

renderStart()
