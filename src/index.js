import { format, prevDate, toDate } from './util/dateUtil.js'
import debounce from './util/debounce.js'

const loadedDates = []

main()

function main() {
  window.addEventListener(
    'scroll',
    debounce(function () {
      if (checkScrollBottom()) {
        loadArticles(prevDate(loadedDates[0]))
      }
    })
  )
  loadArticles(new Date())
}

// 检查是否滚动到底部的函数
function checkScrollBottom() {
  // 页面当前高度 + 窗口可视区域高度 >= 文档高度
  return (
    document.documentElement.scrollHeight -
      (window.innerHeight + document.documentElement.scrollTop) <
    10
  )
}

function appendArticleEl(article) {
  const cardTemplate = document.querySelector('#card')
  const aEls = cardTemplate.content.querySelectorAll('a')
  for (const a of aEls) {
    a.href = article.href
  }

  const img = cardTemplate.content.querySelector('img')
  img.src = `${article.dataDir}/${article.img}`

  const h3 = cardTemplate.content.querySelector('h3')
  h3.textContent = article.title

  const timeEl = cardTemplate.content.querySelector('.bottom-line__time')
  timeEl.textContent = article.dateTime

  const listEl = document.querySelector('.article-list')
  const clone = document.importNode(cardTemplate.content, true)
  listEl.appendChild(clone)
}

/**
 *
 * @param {Date} date
 */
async function loadArticles(date) {
  date = format(date, 'yyyy/mm/dd')
  if (loadedDates.indexOf(date) > -1) {
    return
  }
  loadedDates.unshift(date)

  const dataDir = `config/article/${date}`
  const res = await fetch(`${dataDir}/data.json`)
  if (res.status === 404) {
    if (toDate(loadedDates[0]) < prevDate(new Date(), 7)) {
      return
    }
    loadArticles(prevDate(loadedDates[0]))
    return
  }
  const articles = await res.json()
  articles.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
  articles.forEach((article) => {
    article.dataDir = dataDir
    appendArticleEl(article)
  })
}
