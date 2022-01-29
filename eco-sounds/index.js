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
}

const maxThemes = Object.keys(themes).length - 1
let themeCounter = 0
let currentTheme = themes[themeCounter]

const soundsMenuItems = document.querySelectorAll('.header__sounds-menu__item')
const prev = document.querySelector('.main___slider__prev-btn')
const next = document.querySelector('.main___slider__next-btn')
const image = document.querySelector('.image')

prev.addEventListener('click', (e) => {
  themeCounter = themeCounter > 0 ? themeCounter - 1 : maxThemes
  changeTheme(themeCounter)
})

next.addEventListener('click', (e) => {
  themeCounter = themeCounter < maxThemes ? themeCounter + 1 : 0
  changeTheme(themeCounter)
})

const changeTheme = (themeCounter) => {
  currentTheme = themes[themeCounter]
  image.src = `assets/themes/${currentTheme.path}/${currentTheme.bg}`

  const audio = Object.keys(currentTheme.audio)
  for (let i = 0; i < soundsMenuItems.length; i++) {
    soundsMenuItems[i].textContent = audio[i]
  }
}
