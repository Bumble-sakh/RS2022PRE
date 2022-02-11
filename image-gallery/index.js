const queryId = 'DPhh7QWX3sURSxFOKV1pJCwLMtmCkKsWBVZXyhLDr9g'
const randomId = 'l-PNstaWCbZt-Gi7lA1M7LLwXavtYSMZ6-WJSXkpIzo'

/* variables */
let isQuery = false
let query = ''
let currentPage = 1
const paginationPagesCount = 3

/* UI */
const main = document.querySelector('.main')
const searchInput = document.querySelector('.search__input')
const searchBtn = document.querySelector('.search__button')
const cancelButton = document.querySelector('.cancel__button')

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
    threshold: 0.9,
  }
)

/* functions */

async function getRandomPhoto() {
  const themes = ['girl', 'car', 'city', 'world', 'beach']
  const query = themes[Math.floor(Math.random() * themes.length)]
  const url = `https://api.unsplash.com/photos/random/?query=${query}&count=26&orientation=landscape&client_id=${randomId}`
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
  const url = `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=26&query=${query}&orientation=landscape&client_id=${queryId}`
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
      window.scrollTo(0, 0)
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
          <button class="image__info__header__favorites btn"  data-id="${imageId}">
            <i class="uil uil-plus"></i>
          </button>
        </div>
        <div class="image__info__footer">
          <div class="image__info__footer__author">${authorName}</div>
          <button class="image__info__footer__download btn">
            <a
              download='download'
              href='${download}'
              target="_blank"
              class="link"
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

  if (isQuery) {
    renderPagination(currentPage, totalPages)
  } else {
    observer.observe(document.querySelector('.gallery:last-child'))
  }
}

function renderPagination(currentPage, totalPages) {
  if (totalPages < 2) return null
  const isFirst = currentPage === 1 ? true : false
  const isLast = currentPage === totalPages ? true : false
  const pagesCount =
    totalPages >= paginationPagesCount
      ? totalPages - currentPage >= paginationPagesCount
        ? paginationPagesCount
        : totalPages - currentPage
      : totalPages

  const pagination = document.createElement('div')
  pagination.classList.add('pagination')

  if (!isFirst) {
    const paginationFirst = renderPaginationButton(
      'pagination__first',
      'uil-angle-double-left',
      1,
      query
    )

    const paginationPrev = renderPaginationButton(
      'pagination__prev',
      'uil-angle-left',
      currentPage - 1,
      query
    )

    pagination.appendChild(paginationFirst)
    pagination.appendChild(paginationPrev)
  }

  const paginationPages = document.createElement('div')
  pagination.classList.add('pagination__pages')

  for (let i = 1; i <= pagesCount; i++) {
    const paginationPage = renderPaginationButton(
      'pagination__page',
      currentPage + i,
      currentPage + i,
      query
    )
    paginationPages.appendChild(paginationPage)
  }

  pagination.appendChild(paginationPages)

  if (!isLast) {
    const paginationNext = renderPaginationButton(
      'pagination__next',
      'uil-angle-right',
      currentPage + 1,
      query
    )
    pagination.appendChild(paginationNext)

    const paginationLast = renderPaginationButton(
      'pagination__last',
      'uil-angle-double-right',
      totalPages,
      query
    )
    pagination.appendChild(paginationLast)
  }

  main.appendChild(pagination)
}

function renderPaginationButton(btnClass, btnIcon, page, query) {
  isNum = typeof btnIcon === 'number' ? true : false
  const button = document.createElement('button')
  button.classList.add('btn')
  button.classList.add(btnClass)

  if (isNum) {
    const buttonIcon = document.createElement('span')
    buttonIcon.innerHTML = btnIcon
    button.appendChild(buttonIcon)
  } else {
    const buttonIcon = document.createElement('i')
    buttonIcon.classList.add('uil')
    buttonIcon.classList.add(btnIcon)
    button.appendChild(buttonIcon)
  }

  button.addEventListener('click', () => {
    getQueryPhoto(query, page).then(renderImages)
  })

  return button
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

searchInput.addEventListener('input', () => {
  if (searchInput.value) {
    cancelButton.classList.remove('hidden')
  } else {
    cancelButton.classList.add('hidden')
  }
})

searchBtn.addEventListener('click', (e) => {
  if (searchInput.value) {
    getPhoto()
  }
})

cancelButton.addEventListener('click', () => {
  searchInput.value = ''
  cancelButton.classList.add('hidden')
})

/* init */

getRandomPhoto().then(renderImages)
