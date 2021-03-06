const Pocket = require('./src/pocket');
const inquirer = require('inquirer');
const urlToMobi = require('./src/converter');
const helper = require('./src/Helper');
const readLine = require('readline');
const EventEmittter = require('events');

const myEmitter = new EventEmittter();
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});
// Main menu question
const questions = [{
    type: 'rawlist',
    name: 'job',
    message: 'What should I do??',
    choices: [
      '1)Get articles from pocket',
      '2)Get articles from list of urls',
      '3)Html to Mobi',
      '4)Send to kindle (wirefull)',
      '5)Send to kindle (wireless)'],
}];

const getNeededInfoCase2 = [{
    type: 'input',
    name: 'urls',
    message: 'Enter the urls with \',\' between as divider: \n',
},{
    type: 'confirm',
    name: 'oneFile',
    message: 'Do you like to merge all of the webpages into one file?',
    default: false,
}];

const getFileNameQuestion = [{
  type: 'input',
  name: 'fileName',
  message: 'What is the fileName?',
}];

// Where docs will be saved
const outputFolder = __dirname + '/article/';

// main function
async function main() {
  try {
    console.log('Hi, welcome to Node Pocket app');

    myEmitter.on('next', async () => {
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
          const answers = await inquirer.prompt(getNeededInfoCase2);

          const urls = answers.urls.split(',');
          
          if(answers.oneFile) {
            const { fileName } = await inquirer.prompt(getFileNameQuestion);

            helper.getWebPages(urls, undefined, fileName)
              .then(fileDirs => {
                console.log(fileDirs);
                myEmitter.emit('next');
              })
              .catch(err => {
                console.log(err);
                myEmitter.emit('next');
              })
          }else {
            helper.getWebPages(urls)
              .then(fileDirs => {
                console.log(fileDirs);
                myEmitter.emit('next');
              })
              .catch(err => {
                console.log(err);
                myEmitter.emit('next');
              })
          }
          break;
        case '3':
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
    } )
  } catch (error) {
   console.log(error); 
   myEmitter.emit('next');
  }
}

main();
myEmitter.emit('next');

// Keep process running
setInterval(() => {}, 1 << 30);