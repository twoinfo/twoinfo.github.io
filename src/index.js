import { format } from './util/dateUtil.js'

const loadedDates = []

main()

function main() {
  loadArticles(new Date())
}

// 监听滚动事件
window.addEventListener('scroll', function () {
  // 检查是否已滚动到页面底部
  if (checkScrollBottom()) {
    // 加载数据的函数
    loadMoreData()
  }
})

// 检查是否滚动到底部的函数
function checkScrollBottom() {
  // 页面当前高度 + 窗口可视区域高度 >= 文档高度
  return (
    document.documentElement.scrollHeight -
      (window.innerHeight + document.documentElement.scrollTop) <
    10
  )
}

// 加载数据的函数
function loadMoreData() {
  // 这里是模拟数据加载的过程
  console.log('加载更多数据...')
  // 实际中，你可能会发起一个AJAX请求来获取数据，然后更新DOM
  // $.ajax({
  //     url: 'your-api-endpoint',
  //     success: function(data) {
  //         // 更新DOM
  //     }
  // });
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
function loadArticles(date) {
  date = format(date, 'yyyy/mm/dd')
  if (loadedDates.indexOf(date) > -1) {
    return
  }
  loadedDates.push(date)

  const dataDir = `config/article/${date}`
  fetch(`${dataDir}/data.json`)
    .then((response) => response.json())
    .then((articles) => {
      articles.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      articles.forEach((article) => {
        article.dataDir = dataDir
        appendArticleEl(article)
      })
    })
    .catch((error) => console.error(error))
}
