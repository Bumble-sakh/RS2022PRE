let language = 'en'

/* UI */

const lng = document.querySelector('.header__lng')
const quote = document.querySelector('.quote')
const favoriteBtn = document.querySelector('.star')
const nextBtn = document.querySelector('.next')

/* functions */

const translate = () => {
  const headerTitle = document.querySelector('.header__title')
  const footerGithub = document.querySelector('.footer__github .link')

  if (language === 'en') {
    document.title = 'Random quotes'
    headerTitle.textContent = 'Random quotes'
    footerGithub.textContent = 'Igor Asessorov'
  } else {
    document.title = 'Случайные цитаты'
    headerTitle.textContent = 'Случайные цитаты'
    footerGithub.textContent = 'Игорь Асессоров'
  }
}

function rnd(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}

async function getQuote() {
  const url = `https://quotes15.p.rapidapi.com/quotes/random/?language_code=${language}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'quotes15.p.rapidapi.com',
      'x-rapidapi-key': 'f3b6867b16msh8c097c3f7e99381p1d1a73jsn1daae0c36253',
    },
  })
  const data = await res.json()

  return data
}

function getImg() {
  const file = rnd(1000, 1999)
  return `https://raw.githubusercontent.com/ozgrozer/100k-faces/master/docs/0/1/00${file}.jpg`
}

function toggleFavoritesIcon() {
  for (const icon of favoriteBtn.children) {
    icon.classList.toggle('icon_hidden')
  }
}

function addFavorites() {
  // toggleFavoritesIcon()
}

function quoteRendering() {
  const quoteData = getQuote().then((data) => {
    const quoteImg = getImg()
    while (quote.firstChild) {
      quote.removeChild(quote.firstChild)
    }
    quote.children
    quote.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="quote__img">
        <img
          src="${quoteImg}"
          alt="Random face"
          class="img"
        />
      </div>
      <div class="quote__container">
        <div class="quote__container__text">${data.content}</div>
        <div class="quote__container__author">${data.originator.name}</div>
      </div>
      `
    )
  })
}

/* listeners */

lng.addEventListener('click', (e) => {
  language = language === 'en' ? 'ru' : 'en'
  lng.textContent = language === 'en' ? 'ru' : 'en'
  translate()
  quoteRendering()
})

nextBtn.addEventListener('click', quoteRendering)

favoriteBtn.addEventListener('click', addFavorites)

/* init */
quoteRendering()
