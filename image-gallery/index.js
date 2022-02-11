const id = 'DPhh7QWX3sURSxFOKV1pJCwLMtmCkKsWBVZXyhLDr9g'

/* variables */
let isQuery = false
let query = ''
let currentPage = 1
const paginationPagesCount = 3

/* UI */
const main = document.querySelector('.main')
const searchInput = document.querySelector('.search__input')
const searchBtn = document.querySelector('.search__button')

/* observers */

let observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)
        console.log('LazyLoad...')
      }
    })
  },
  {
    threshold: 0.3,
  }
)

/* functions */

async function getRandomPhoto() {
  const themes = ['girl', 'car', 'city', 'world', 'beach']
  const query = themes[Math.floor(Math.random() * themes.length)]
  const url = `https://api.unsplash.com/photos/random/?query=${query}&count=26&orientation=landscape&client_id=${id}`
  const data = await fetch(url)
  const result = {
    current_page: 0,
    total_pages: 0,
    results: await data.json(),
  }
  console.log('Random', result)
  return result
}

async function getQueryPhoto(query, currentPage = 1) {
  const url = `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=26&query=${query}&orientation=landscape&client_id=${id}`
  const data = await fetch(url)
  const result = await data.json()
  result['current_page'] = currentPage
  currentPage++
  console.log('Query', result)
  return result
}

function renderImages({
  current_page: currentPage,
  total_pages: totalPages,
  results: images,
}) {
  if (isQuery) {
    while (main.lastElementChild) {
      main.removeChild(main.lastElementChild)
    }
  }

  const container = document.createElement('div')
  container.classList.add('gallery')

  images.forEach((image) => {
    const imageId = image.id
    const download = `https://unsplash.com/photos/${imageId}/download?force=true`
    const url = image.urls.regular
    const alt = image.alt_description
    const authorName = image.user.name
    // const authorAvatar = image.user.profile_image.small

    container.insertAdjacentHTML(
      'afterbegin',
      `
    <div class="gallery__image">
      <img src="${url}" alt="${alt}" />
      <div class="image__info">
        <div class="image__info__header">
          <button class="image__info__header__favorites"  data-id="${imageId}">
            <i class="uil uil-plus"></i>
          </button>
        </div>
        <div class="image__info__footer">
          <div class="image__info__footer__author">${authorName}</div>
          <button class="image__info__footer__download">
            <a
              download='download'
              href='${download}'
              target="_blank"
              ><i class="uil uil-download-alt"></i
            ></a>
          </button>
        </div>
      </div>
    </div>
    `
    )
  })

  main.appendChild(container)

  observer.observe(document.querySelector('.gallery:last-child'))
}

function getPhoto() {
  query = searchInput.value
  isQuery = query ? true : false

  if (isQuery) {
    getQueryPhoto(query).then(renderImages)
  } else {
    getRandomPhoto().then(renderImages)
  }
}

/* Listeners */

searchInput.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault()
    getPhoto()
  }
})

searchBtn.addEventListener('click', (e) => {
  e.preventDefault()
  getPhoto()
})

/* init */

getRandomPhoto().then(renderImages)
