const themes = {
  0: {
    name: 'Summer forest',
    path: 'summer_forest',
    bg: 'bg.jpg',
    audio: {
      Forest: 'summer_forest_birds_close.mp3',
      Birds: 'summer_forest_birds_main.mp3',
      Stream: 'summer_forest_river.mp3',
    },
  },
  1: {
    name: 'Night forest',
    path: 'night_forest',
    bg: 'bg.jpg',
    audio: {
      Forest: 'night_forest_cicadas.mp3',
      Campfire: 'night_forest_campfire.mp3',
      Animals: 'night_forest_animals.mp3',
    },
  },
  2: {
    name: 'Lake',
    path: 'lake',
    bg: 'bg.jpg',
    audio: {
      Cicadas: 'lake_cicadas.mp3',
      Birds: 'lake_birds.mp3',
      Frogs: 'lake_frogs.mp3',
    },
  },
  2: {
    name: 'Sea',
    path: 'sea',
    bg: 'bg.jpg',
    audio: {
      Waves: 'sea_main.mp3',
      ' Water splash': 'sea_close.mp3',
      Seagulls: 'sea_seagulls.mp3',
    },
  },
  3: {
    name: 'Fireplace',
    path: 'fireplace',
    bg: 'bg.jpg',
    audio: {
      Rain: 'rain_main.mp3',
      Thunder: 'fireplace_thunder.mp3',
      Fire: 'fireplace_fire.mp3',
    },
  },
  4: {
    name: 'Cave',
    path: 'cave',
    bg: 'bg.jpg',
    audio: {
      Cave: 'cave_scary.mp3',
      Drops: 'cave_main.mp3',
      Torch: 'cave_torch.mp3',
    },
  },
}

const soundsMenuItems = document.querySelectorAll('.header__sounds-menu__item')
const prev = document.querySelector('.main___slider__prev-btn')
const next = document.querySelector('.main___slider__next-btn')
const image = document.querySelector('.image')
const playBtn = document.querySelector('.main___slider__btn')

const maxThemes = Object.keys(themes).length - 1
let themeCounter = 0
let currentTheme = themes[themeCounter]
const audio = []
let isPlay = false

function initAudio() {
  playBtn.classList.remove('pause')
  audio.length = 0
  const sounds = Object.keys(currentTheme.audio)
  for (let i = 0; i < sounds.length; i++) {
    audio.push(
      new Audio(
        `assets/themes/${currentTheme.path}/${currentTheme.audio[sounds[i]]}`
      )
    )
    audio[i].currentTime = 0
    audio[i].loop = true
  }
}

function playSound(e) {
  const sound = e.target.dataset.sound
  if (audio[sound].paused) {
    audio[sound].play()
    e.target.classList.add('play')
    isPlay = true
    playBtn.classList.add('pause')
  } else {
    audio[sound].pause()
    e.target.classList.remove('play')
    if (audio.every((sound) => sound.paused)) {
      isPlay = false
      playBtn.classList.remove('pause')
    }
  }
}

function playAudio() {
  if (isPlay) {
    audio.forEach((sound, index) => {
      document.querySelector(`[data-sound="${index}"]`).classList.remove('play')
      sound.pause()
    })
    isPlay = false
    playBtn.classList.remove('pause')
  } else {
    audio.forEach((sound, index) => {
      document.querySelector(`[data-sound="${index}"]`).classList.add('play')
      sound.play()
    })
    isPlay = true
    playBtn.classList.add('pause')
  }
}

function stopAudio() {
  audio.forEach((sound) => {
    sound.pause()
  })
  isPlay = false
}

playBtn.addEventListener('click', (e) => {
  playAudio()
})

prev.addEventListener('click', (e) => {
  themeCounter = themeCounter > 0 ? themeCounter - 1 : maxThemes
  changeTheme(themeCounter)
})

next.addEventListener('click', (e) => {
  themeCounter = themeCounter < maxThemes ? themeCounter + 1 : 0
  changeTheme(themeCounter)
})

function changeTheme(themeCounter = 0) {
  stopAudio()
  soundsMenuItems.forEach((item) => item.classList.remove('play'))
  currentTheme = themes[themeCounter]
  const sounds = Object.keys(currentTheme.audio)
  image.src = `assets/themes/${currentTheme.path}/${currentTheme.bg}`
  for (let i = 0; i < soundsMenuItems.length; i++) {
    soundsMenuItems[i].textContent = sounds[i]
    soundsMenuItems[i].addEventListener('click', playSound)
  }
  initAudio()
}

/* Init */

initAudio()
changeTheme()
