const Pocket = require('./src/pocket');
const inquirer = require('inquirer');
const urlToMobi = require('./src/converter');

const questions = [
  {
    type: 'rawlist',
    name: 'job',
    message: 'What should I do??',
    choices: ['1)Get articles', '2)Send to kindle (WireFull)', '3)Get and send article to kindl'],
  },
];
const outputFolder = __dirname + '/article/';

async function main() {
  try {
    const pocket = await Pocket.build('96126-d71e8b7e2255a5075eb0c83c', 'https://www.google.com');

    console.log('Hi, welcome to Node Pocket app');

    while(true) {
      const choice = (await inquirer.prompt(questions)).job[0];
      
      if(choice === '1') {
        let articles = await pocket.getArticle({
          count: 1,
          detailType: 'simple',
        });

        console.log('Articles received!');

        const converters = []; 

        articles = Object.values(articles);
        articles.forEach(article => {
          article.path = outputFolder + article.resolved_title + '.mobi';
          converters.push(urlToMobi(article.resolved_url, article.path));
        });

        await Promise.all(converters);

        console.log('Finished');
      }else if(choice === '2') {

      }
    }
  } catch (error) {
   console.log(error); 
  }
}

main();