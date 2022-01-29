/* Self rating */

const checked = String.fromCodePoint(0x2705)

console.info(
  '%cСамооценка 85/85 :\n',
  'color: lightgreen; font-family:monospace; font-size: 14px; font-weight: 600;'
)

console.groupCollapsed(`${checked} Смена изображений в секции portfolio +25`)
console.log(`${checked} при кликах по кнопкам Winter, Spring, Summer, Autumn в секции portfolio отображаются изображения из папки с соответствующим названием +20
${checked} кнопка, по которой кликнули, становится активной т.е. выделяется стилем. Другие кнопки при этом будут неактивными +5
 секция skills +6`)
console.groupEnd()

console.groupCollapsed(`${checked} Перевод страницы на два языка +25`)
console.log(`${checked} при клике по надписи ru англоязычная страница переводится на русский язык +10
${checked} при клике по надписи en русскоязычная страница переводится на английский язык +10
${checked} надписи en или ru, соответствующие текущему языку страницы, становятся активными т.е. выделяются стилем +5`)
console.groupEnd()

console.groupCollapsed(`${checked} Переключение светлой и тёмной темы +25`)
console.log(`${checked} тёмная тема приложения сменяется светлой +10
${checked} светлая тема приложения сменяется тёмной +10
${checked} после смены светлой и тёмной темы интерактивные элементы по-прежнему изменяют внешний вид при наведении и клике и при этом остаются видимыми на странице (нет ситуации с белым шрифтом на белом фоне) +5`)
console.groupEnd()

console.log(
  `${checked} Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5`
)

console.log(
  `${checked} Дополнительный функционал: сложные эффекты для кнопок при наведении и/или клике +5`
)
/* end self rating */

/* Global variables */
import text from './translate.js'

let settings = getLocalStorage()

const lngToggle = document.querySelector('.header-language')
const textsList = document.querySelectorAll('[data-text]')
const portfolioNav = document.querySelector('.portfolio-nav')
const portfolioPictures = document.querySelector('.portfolio-pictures')
const themeToggle = document.querySelector('.header-theme')
const burgerBtn = document.querySelector('.burger')
const menu = document.querySelector('.header-nav-menu')
const menuLinks = document.querySelectorAll('.header-nav-menu-link')
const fade = document.querySelector('.fade')

/* Global functions */

function setLocalStorage(variable, value) {
  localStorage.setItem(variable, value)
}

function getLocalStorage() {
  const language = localStorage.getItem('language') || 'en'
  const seasons = localStorage.getItem('seasons') || [
    'winter',
    'spring',
    'summer',
    'autumn',
  ]
  const season = localStorage.getItem('season') || 'winter'
  const theme = localStorage.getItem('theme') || 'light'

  return {
    language: language,
    seasons: seasons,
    season: season,
    theme: theme,
  }
}

function picPreloader(seasons) {
  let count = 0
  seasons.forEach((season) => {
    for (let i = 1; i <= 6; i++) {
      const pic = new Image()
      pic.src = `./assets/img/portfolio/${season}/${i}.jpg`
      count++
    }
  })
  console.info(`${count} images preloaded`)
}

function translateText(lng) {
  textsList.forEach((item) => {
    const data = item.dataset.text
    item.textContent = text[lng][data]
  })
}

function seasonActivate(target) {
  const season = target.dataset.season

  for (const child of portfolioNav.children) {
    target.classList.add('portfolio-nav-button-active')
    if (child.classList.contains('portfolio-nav-button-active')) {
      child.classList.remove('portfolio-nav-button-active')
    }
  }
  target.classList.add('portfolio-nav-button-active')

  for (let i = 0; i < portfolioPictures.children.length; i++) {
    const pic = portfolioPictures.children[i]
    pic.src = `assets/img/portfolio/${season}/${i + 1}.jpg`
    pic.alt = `${season}-photo-${i + 1}`
  }
  setLocalStorage('season', season)
}

function changeTheme(theme) {
  for (const icon of themeToggle.children) {
    icon.classList.remove('active')
    if (icon.dataset.theme === theme) {
      icon.classList.add('active')
    }
  }

  for (const item of document.body.classList) {
    document.body.classList.remove(item)
  }

  document.body.classList.add(`${theme}-theme`)
}

function initial() {
  // Language
  const lngBtn = document.querySelector(
    `[data-language='${settings.language}']`
  )
  lngBtn.classList.add('language-active')
  translateText(settings.language)

  // Season
  const seasonActiveBtn = document.querySelector(
    `[data-season="${settings.season}"]`
  )
  seasonActivate(seasonActiveBtn)

  // Theme

  changeTheme(settings.theme)

  // Preloader
  picPreloader(settings.seasons)
}

/* Initial */

initial()

/* Global listener */

// window.addEventListener('load', getLocalStorage)

/* Burger */

function burgerMenuToggle(e) {
  if (window.innerWidth <= 768) {
    menu.classList.toggle('closed')
    menu.classList.toggle('opened')
    burgerBtn.classList.toggle('opened')
    fade.classList.toggle('hide')
  }
}

burgerBtn.addEventListener('click', burgerMenuToggle)
fade.addEventListener('click', burgerMenuToggle)
menuLinks.forEach((link) => {
  link.addEventListener('click', burgerMenuToggle)
})

/* Portfolio images */
portfolioNav.addEventListener('click', (e) => {
  if (e.target.classList.contains('portfolio-nav-button')) {
    seasonActivate(e.target)
  }
})

/* Translate */

lngToggle.addEventListener('click', (e) => {
  if (e.target.classList.contains('language')) {
    const lngActive = document.querySelector('.language-active')

    if (e.target !== lngActive) {
      const lng = e.target.dataset.language
      settings.language = lng
      lngActive.classList.remove('language-active')
      e.target.classList.add('language-active')

      /* translate section */
      translateText(lng)

      /* local storage */
      setLocalStorage('language', settings.language)
    }
  }
})

/* Theme */

themeToggle.addEventListener('click', (e) => {
  if (e.target.classList.contains('header-theme-icon')) {
    const theme = e.target.dataset.theme === 'light' ? 'dark' : 'light'
    setLocalStorage('theme', theme)
    changeTheme(theme)
  }
})
