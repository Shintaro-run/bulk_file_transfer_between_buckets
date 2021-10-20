const inquirer = require('inquirer');
const chalk = require('chalk');

module.exports = async () => {
  const prompt = await inquirer.prompt({
    'type': 'input',
    'name': 'keyword',
    'message': 'Keyword to filter by?',
    'suffix': chalk.gray` (enter to skip)`,
  });

  return prompt.keyword;
};
