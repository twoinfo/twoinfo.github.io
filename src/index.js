import { format, prevDate, toDate } from './util/dateUtil.js'
import debounce from './util/debounce.js'

const loadedDates = []

main()

async function main() {
  window.addEventListener(
    'scroll',
    debounce(async () => {
      if (!checkScrollBottom()) {
        return
      }
      let currentDate = loadedDates[0]
      let count = 0
      let requestCount = 0
      while (count < 5) {
        currentDate = prevDate(currentDate)
        const articles = await loadArticles(currentDate)
        count += articles ? articles.length : 0
        requestCount++
        if (requestCount > 7) {
          break
        }
      }
    })
  )

  const topArticles = await loadArticles()
  let initCount = topArticles ? topArticles.length : 0

  const initSize = 24
  let currentLoadDate = new Date()
  while (initCount < initSize) {
    currentLoadDate = prevDate(currentLoadDate)
    const dateArticles = await loadArticles(currentLoadDate)
    initCount += dateArticles ? dateArticles.length : 0
  }
}

// 检查是否滚动到底部的函数
function checkScrollBottom() {
  // 页面当前高度 + 窗口可视区域高度 >= 文档高度
  return (
    document.documentElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) < 400
  )
}

function appendArticleEl(article) {
  const cardTemplate = document.importNode(document.querySelector('#card').content, true)
  const aEls = cardTemplate.querySelectorAll('a')
  for (const a of aEls) {
    a.href = article.href
  }

  const img = cardTemplate.querySelector('img')
  const imgName = article.img
  if (!imgName.startsWith('/')) {
    img.src = `${article.dataDir}/${article.img}`
  } else {
    img.src = imgName
  }

  const h3 = cardTemplate.querySelector('h3')
  h3.textContent = article.title
  if (article.isTop) {
    h3.classList.add('top')
  }

  const timeEl = cardTemplate.querySelector('.bottom-line__time')
  timeEl.textContent = article.dateTime

  const listEl = document.querySelector('.article-list')
  listEl.appendChild(cardTemplate)
}

/**
 * 加载文章
 * @param {Date} date
 * @returns {Promise<null|object[]>}
 */
async function loadArticles(date = null) {
  date = date ? date : 'top'
  if (date !== 'top') {
    date = format(date, 'yyyy/mm/dd')
    if (loadedDates.indexOf(date) > -1) {
      return null
    }
    loadedDates.unshift(date)
  }

  const dataDir = `config/article/${date}`
  const res = await fetch(`${dataDir}/data.json`)
  if (res.status === 404) {
    console.warn(`${dataDir}/data.json does not exist.`)
    return null
  }
  const articles = await res.json()
  articles.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
  articles.forEach((article) => {
    article.dataDir = dataDir
    article.isTop = date === 'top'
    appendArticleEl(article)
  })
  return articles
}
