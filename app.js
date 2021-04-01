const Pocket = require('./src/pocket');
const inquirer = require('inquirer');
const urlToMobi = require('./src/converter');
const Helper = require('./src/Helper');

// Main menue question
const questions = [
  {
    type: 'rawlist',
    name: 'job',
    message: 'What should I do??',
    choices: [
      '1)Get articles',
      '2)Html to Mobi',
      '3)Send to kindle (wirefull)',
      '4)Send to kindle (wireless)'],
  },
];
// Where docs will be saved
const outputFolder = __dirname + '/article/';

async function main() {
  try {
    console.log('Hi, welcome to Node Pocket app');

    while(true) {
      const choice = (await inquirer.prompt(questions)).job[0];
      
      switch (choice) {
        case '1':
          //Autherize pocket
          const pocket = await Pocket.build('96126-d71e8b7e2255a5075eb0c83c', 'https://www.google.com');

          // Get articles info from pocket site
          let articles = await pocket.getArticle({
            count: 1,
            detailType: 'simple',
          });
          console.log('Articles received!');

          console.log('Finished');
          break;
        case '2':
          // Converted articles
          const converters = []; 

          // Convert articles
          articles = Object.values(articles);
          articles.forEach(article => {
            article.path = outputFolder + article.resolved_title + '.mobi';
            converters.push(urlToMobi(article.resolved_url, article.path));
          });
          await Promise.all(converters);
          break;
        default:
          console.log('Invalid choice!');
          break;
      }
    }
  } catch (error) {
   console.log(error); 
  }
}

main();