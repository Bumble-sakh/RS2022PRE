let symbol = 'cross'
let startGame = 0
let endGame = {}
let isEnd = false
let isMusic = false
let score = localStorage.score1337 ? JSON.parse(localStorage.score1337) : []

const music = new Audio('assets/sounds/music.mp3')
music.volume = 0.1
music.loop = true

const clickSnd = new Audio('assets/sounds/click.mp3')
const moveSnd = new Audio('assets/sounds/move.mp3')

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

const main = document.querySelector('.main')

function initGame() {
  symbol = 'cross'
  endGame = {}
  isEnd = false
  turns.cross = ''
  turns.circle = ''
  renderBoard()
  startGame = Date.now()
  setTimeout(timer, 500)
  // music.play()
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
  localStorage.setItem('score1337', JSON.stringify(score))

  const resultBlock = `
  <div class="result">
    <div class="result__title">${result} ${
    result === 'draw' ? '' : symbol
  }</div>
    <div class="result__turns">${turn} turns</div>
    <div class="result__table">
      <table class="table">
        <thead>
          <tr>
            <th>Result</th>
            <th>Turns</th>
            <th>Time</th>
          </tr>
        </thead>  
        <tbody>
          ${renderScore()}
        </tbody>
      </table>
    </div>
    <div class="result__restart-btn">
      <button class="restart-btn btn">Try again</button>
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
  <div class="game">
    <div class="game__header">
      <div class="back">
        <button class="back-btn btn">Back</button>
      </div>
      <div class="music">Music: <button class="music-btn ${
        isMusic ? '' : 'off'
      } btn">${isMusic ? 'On' : 'Off'}</button></div>
    </div>
    <div class="game__main">
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
    </div>
    <div class="game__footer">
      <div class="time">00:00</div>
    </div>
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
  if (time) {
    time.textContent = `${min}:${sec}`
  }
  endGame = { min: min, sec: sec }
  if (isEnd) {
    return (endGame = { min: min, sec: sec })
  }
  setTimeout(timer, 100)
}

function selfRating() {
  console.log(`
  Score: 70 / 70
- [x] Вёрстка +10
    - реализован интерфейс игры +5
    - в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, [логотип курса](https://rs.school/images/rs_school_js.svg) со [ссылкой на курс](https://rs.school/js-stage0/) +5
- [x] При кликах по игровому полю по очереди отображаются крестики и нолики. Первая фигура всегда крестик +10
- [x] Игра завершается, когда три фигуры выстроились в ряд по вертикали, горизонтали или диагонали +10
- [x] По окончанию игры выводится её результат - выигравшая фигура и количество ходов от начала игры до её завершения +10
- [x] Результаты последних 10 игр сохраняются в local storage. Есть таблица рекордов, в которой отображаются результаты предыдущих 10 игр +10
- [x] Анимации или звуки, или настройки игры. Баллы начисляются за любой из перечисленных пунктов +10
- [x] Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10
    - высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо
  `)
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
  if (e.target.classList.contains('back-btn')) {
    clickSnd.play()
    isMusic = false
    renderStart()
  }
  if (e.target.classList.contains('music-btn')) {
    const musicBtn = document.querySelector('.music-btn')
    clickSnd.play()
    if (isMusic) {
      isMusic = false
      music.pause()
      music.currentTime = 0
      musicBtn.classList.add('off')
    } else {
      isMusic = true
      music.play()
      musicBtn.classList.remove('off')
    }
    musicBtn.textContent = isMusic ? 'On' : 'Off'
  }
})

/* init */

renderStart()
selfRating()
