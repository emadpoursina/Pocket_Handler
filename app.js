const Pocket = require('./src/pocket');
const inquirer = require('inquirer');

const questions = [
  {
    type: 'rawlist',
    name: 'job',
    message: 'What should I do??',
    choices: ['1)Get articles', '2)Send to kindle', '3)Get and send article to kindl'],
  },
];

async function main() {
  const pocket = await Pocket.build('	96126-d71e8b7e2255a5075eb0c83c', 'https://www.google.com');

  console.log('Hi, welcome to Node Pocket app');

  while(true) {
    const choice = (await inquirer.prompt(questions)).job[0];
    switch (choice) {
      case 1:
        break;
      case 2:
        
        break;
      case 3:
        
        break;
    }
  }
}

main();