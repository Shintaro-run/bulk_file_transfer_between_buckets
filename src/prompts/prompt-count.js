const inquirer = require('inquirer');
const chalk = require('chalk');

module.exports = async () => {
  const prompt = await inquirer.prompt({
    'type': 'number',
    'name': 'number',
    'message': 'How many files to transfer?',
    'suffix': chalk.gray` Press enter to skip`,
  });

  return prompt.number;
};
