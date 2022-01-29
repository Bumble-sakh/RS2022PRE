/* Self rating */

const checked = String.fromCodePoint(0x2705)

console.info(
  '%cСамооценка 85/85 :\n',
  'color: lightgreen; font-family:monospace; font-size: 14px; font-weight: 600;'
)

console.groupCollapsed(
  `${checked} Вёрстка соответствует макету. Ширина экрана 768px +48`
)
console.log(`${checked} блок <header> +6
${checked} секция hero +6
${checked} секция skills +6
${checked} секция portfolio +6
${checked} секция video +6
${checked} секция price +6
${checked} секция contacts +6
${checked} блок <footer> +6`)
console.groupEnd()

console.groupCollapsed(
  `${checked} Ни на одном из разрешений до 320px включительно не появляется горизонтальная полоса прокрутки. Весь контент страницы при этом сохраняется: не обрезается и не удаляется +15`
)
console.log(`${checked} нет полосы прокрутки при ширине страницы от 1440рх до 768рх +5
${checked} нет полосы прокрутки при ширине страницы от 768рх до 480рх +5
${checked} нет полосы прокрутки при ширине страницы от 480рх до 320рх +5`)
console.groupEnd()

console.groupCollapsed(
  `${checked} На ширине экрана 768рх и меньше реализовано адаптивное меню +22`
)
console.log(`${checked} при ширине страницы 768рх панель навигации скрывается, появляется бургер-иконка +2
${checked} при нажатии на бургер-иконку справа плавно появляется адаптивное меню, бургер-иконка изменяется на крестик +4
${checked} высота адаптивного меню занимает всю высоту экрана. При ширине экрана 768-620рх вёрстка меню соответствует макету, когда экран становится уже, меню занимает всю ширину экрана +4
${checked} при нажатии на крестик адаптивное меню плавно скрывается уезжая за правую часть экрана, крестик превращается в бургер-иконку +4
${checked} бургер-иконка, которая при клике превращается в крестик, создана при помощи css-анимаций без использования изображений +2
${checked} ссылки в адаптивном меню работают, обеспечивая плавную прокрутку по якорям +2
${checked} при клике по ссылке в адаптивном меню адаптивное меню плавно скрывается, крестик превращается в бургер-иконку +4`)
console.groupEnd()

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
