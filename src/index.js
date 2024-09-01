fetch('config/articles.json')
  .then((response) => response.json())
  .then((articles) => {
    articles.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    articles.forEach((article) => {
      const cardTemplate = document.querySelector('#card')
      const aEls = cardTemplate.content.querySelectorAll('a')
      for (const a of aEls) {
        a.href = article.href
      }

      const img = cardTemplate.content.querySelector('img')
      img.src = article.img

      const h3 = cardTemplate.content.querySelector('h3')
      h3.textContent = article.title

      const timeEl = cardTemplate.content.querySelector('.bottom-line__time')
      timeEl.textContent = article.dateTime

      const listEl = document.querySelector('.article-list')
      const clone = document.importNode(cardTemplate.content, true)
      listEl.appendChild(clone)
    })
  })
  .catch((error) => console.error(error))
