const Pocket = require('./src/pocket');
const inquirer = require('inquirer');
const urlToEpub = require('./src/converter');

const questions = [
  {
    type: 'rawlist',
    name: 'job',
    message: 'What should I do??',
    choices: ['1)Get articles', '2)Send to kindle (WireFull)', '3)Get and send article to kindl'],
  },
];
const outputFolder = '/media/emad/Kindle/documents';

async function main() {
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
      let converter;

      articles = Object.values(articles);
      articles.forEach(article => {
      });

      await Promise.all(converters);

      console.log('Finished');
    }else if(choice === '2') {

    }
  }
}

main();