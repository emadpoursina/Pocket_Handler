const getArticle = require('./src/pocket');

async function main() {
  // Get articles from pocket server
  const articles = await getArticle();
}

main();