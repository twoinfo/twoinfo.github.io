import { format, prevDate, toDate } from './util/dateUtil.js'
import debounce from './util/debounce.js'

const loadedDates = []

main()

async function main() {
  window.addEventListener(
    'scroll',
    debounce(async () => {
      if (checkScrollBottom()) {
        const beginDate = loadedDates[0]
        for (let i = 1; i <= 7; i++) {
          await loadArticles(prevDate(beginDate, i))
        }
      }
    })
  )

  await loadArticles('top')
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    await loadArticles(prevDate(today, i))
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
  const cardTemplate = document.querySelector('#card')
  const aEls = cardTemplate.content.querySelectorAll('a')
  for (const a of aEls) {
    a.href = article.href
  }

  const img = cardTemplate.content.querySelector('img')
  const imgName = article.img
  if (!imgName.startsWith('/')) {
    img.src = `${article.dataDir}/${article.img}`
  } else {
    img.src = imgName
  }

  const h3 = cardTemplate.content.querySelector('h3')
  h3.textContent = article.title
  if (article.isTop) {
    h3.classList.add('top')
  }

  const timeEl = cardTemplate.content.querySelector('.bottom-line__time')
  timeEl.textContent = article.dateTime

  const listEl = document.querySelector('.article-list')
  const clone = document.importNode(cardTemplate.content, true)
  listEl.appendChild(clone)
}

/**
 * 加载文章
 * @param {Date} date
 */
async function loadArticles(date) {
  if (date !== 'top') {
    date = format(date, 'yyyy/mm/dd')
    if (loadedDates.indexOf(date) > -1) {
      return
    }
    loadedDates.unshift(date)
  }

  const dataDir = `config/article/${date}`
  const res = await fetch(`${dataDir}/data.json`)
  if (res.status === 404) {
    console.warn(`${dataDir}/data.json does not exist.`)
    return
  }
  const articles = await res.json()
  articles.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
  articles.forEach((article) => {
    article.dataDir = dataDir
    article.isTop = date === 'top'
    appendArticleEl(article)
  })
}
