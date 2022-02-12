const queryId = 'DPhh7QWX3sURSxFOKV1pJCwLMtmCkKsWBVZXyhLDr9g'
const randomId = [
  'l-PNstaWCbZt-Gi7lA1M7LLwXavtYSMZ6-WJSXkpIzo',
  'u2oN4WP0CW74WNuBBy2pbWDe4sBptOSA8H5ZSKXV18E',
  '2JAYGhP7pU3P7PviqWiRhWP2NZp9XrULb3AbMvrO50M',
  'm04wUMU11U1rks-s4PrmJABXOOT9S7VQSUTgaIkGNRw',
  'RzA2GRrNiUVb-cfLP3w-qYvcJO4G0fV0Xp4sOw0HRBI',
]
let randomIdCount = 0

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

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)
        console.log('LazyLoad...')
        getRandomPhoto().then(renderImages)
      }
    })
  },
  {
    threshold: 0.1,
  }
)

/* functions */

async function getRandomPhoto() {
  const themes = ['girl', 'car', 'city', 'world', 'beach']
  const query = themes[Math.floor(Math.random() * themes.length)]
  const url = `https://api.unsplash.com/photos/random/?query=${query}&count=26&orientation=landscape&client_id=${randomId[randomIdCount]}`
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 403) {
      randomIdCount++
      console.log('New ID - ', randomId[randomIdCount])
      const alertText = `
      Demo access allows only 50 requests per hour. After clicking 'OK', I'll try to change the request ID. If the photos do not appear, try to check the work after 1 hour.

      Демо доступ разрешает только 50 запросов в час. После нажатия 'ОК' я попробую поменять ID для запросов. Если фото не появятся, попробуйте проверить работу через 1 час.
      `
      alert(alertText)
      getRandomPhoto().then(renderImages)
    }
  }
  const result = {
    current_page: 0,
    total_pages: 0,
    results: await response.json(),
  }
  console.log('Random', result)
  return result
}

async function getQueryPhoto(query, currentPage = 1) {
  const url = `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=26&query=${query}&orientation=landscape&client_id=${queryId}`
  const response = await fetch(url)
  const result = await response.json()
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

  if (isFirst) {
    paginationFirst.classList.add('hidden')
    paginationPrev.classList.add('hidden')
  }

  pagination.appendChild(paginationFirst)
  pagination.appendChild(paginationPrev)

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

  const paginationNext = renderPaginationButton(
    'pagination__next',
    'uil-angle-right',
    currentPage + 1,
    query
  )

  const paginationLast = renderPaginationButton(
    'pagination__last',
    'uil-angle-double-right',
    totalPages,
    query
  )

  if (isLast) {
    paginationNext.classList.add('hidden')
    paginationLast.classList.add('hidden')
  }
  pagination.appendChild(paginationNext)
  pagination.appendChild(paginationLast)

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

function selfRating() {
  console.log(`
Score: 70 / 70
- [x] Вёрстка +10
    - на странице есть несколько фото и строка поиска +5
    - в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, [логотип курса](https://rs.school/images/rs_school_js.svg) со [ссылкой на курс](https://rs.school/js-stage0/) +5
- [x] При загрузке приложения на странице отображаются полученные от API изображения +10
- [x] Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся изображения соответствующей тематики, если такие данные предоставляет API +10
- [x] Поиск +30
    - при открытии приложения курсор находится в поле ввода +5
    - есть placeholder +5
    - автозаполнение поля ввода отключено (нет выпадающего списка с предыдущими запросами) +5
    - поисковый запрос можно отправить нажатием клавиши Enter +5
    - после отправки поискового запроса и отображения результатов поиска, поисковый запрос продолжает отображаться в поле ввода +5
    - в поле ввода есть крестик при клике по которому поисковый запрос из поля ввода удаляется и отображается placeholder +5
- [x] Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10
    - высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо
  `)

  console.log(`
Доп. функционал:
- [x] Для вывода фотографий реализована несимметричная сетка.
- [x] На стартовой страницу реализована бесконечная лента. При приближении к концу страницы автоматически продгружаются новые случайные фото.
  !!! Не злоупотребляйте, пожалуйста этим функционалом, т.к. по умолчанию доступно только 50 запросов в час. !!!
- [x] При выводе фото по запросу реализована пагинация - разделение большого массива данных, на отдельные страницы для удобства использования.
- [x] Реализованна кнопка для скачивания понравившегося фото.
  `)
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

selfRating()

getRandomPhoto().then(renderImages)
