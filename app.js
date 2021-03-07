const Pocket = require('./src/pocket');

async function main() {
  const pocket = await Pocket.build('	96126-d71e8b7e2255a5075eb0c83c', 'https://www.google.com');

  // Get articles from pocket server with custome filter
  const articles = await pocket.getArticle({
    count: 1,
    detailType: 'simple',
  });
}

main();