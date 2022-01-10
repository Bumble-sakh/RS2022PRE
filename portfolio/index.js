const checked = String.fromCodePoint(0x2705)

console.info(
  '%cСамооценка 110/110 :\n',
  'color: lightgreen; font-family:monospace; font-size: 14px; font-weight: 600;'
)

console.log(`${checked} Вёрстка валидная +10`)

console.groupCollapsed(`${checked} Вёрстка семантическая +20`)
console.log(`${checked} <header>, <main>, <footer> +2
${checked} шесть элементов <section> (по количеству секций) +2
${checked} только один заголовок <h1> +2
${checked} пять заголовков <h2> (количество секций минус одна, у которой заголовок <h1>) +2
${checked} один элемент <nav> (панель навигации) +2
${checked} два списка ul > li > a (панель навигации, ссылки на соцсети) +2
${checked} десять кнопок <button> +2
${checked} два input: <input type="email"> и <input type="tel"> +2
${checked} один элемент <textarea> +2
${checked} три атрибута placeholder +2`)
console.groupEnd()

console.groupCollapsed(`${checked} Вёрстка соответствует макету +48`)
console.log(`${checked} блок <header> +6
${checked} секция hero +6
${checked} секция skills +6
${checked} секция portfolio +6
${checked} секция video +6
${checked} секция price +6
${checked} секция contacts +6
${checked} блок <footer> +6`)
console.groupEnd()

console.groupCollapsed(`${checked} Требования к css + 12`)
console.log(`${checked} для построения сетки используются flex или grid +2
${checked} при уменьшении масштаба страницы браузера вёрстка размещается по центру, а не сдвигается в сторону +2
${checked} фоновый цвет тянется на всю ширину страницы +2
${checked} иконки добавлены в формате .svg. SVG может быть добавлен любым способом. Обращаем внимание на формат, а не на способ добавления +2
${checked} изображения добавлены в формате .jpg +2
${checked} есть favicon +2`)
console.groupEnd()

console.groupCollapsed(`${checked} Интерактивность, реализуемая через css +20`)
console.log(`${checked} плавная прокрутка по якорям +5
${checked} ссылки в футере ведут на github автора проекта и на страницу курса https://rs.school/js-stage0/ +5
${checked} интерактивность включает в себя не только изменение внешнего вида курсора, например, при помощи свойства cursor: pointer, но и другие визуальные эффекты, например, изменение цвета фона или цвета шрифта. Если в макете указаны стили при наведении и клике, для элемента указываем эти стили. Если в макете стили не указаны, реализуете их по своему усмотрению, руководствуясь общим стилем макета +5
${checked} обязательное требование к интерактивности: плавное изменение внешнего вида элемента при наведении и клике не влияющее на соседние элементы +5`)
console.groupEnd()
