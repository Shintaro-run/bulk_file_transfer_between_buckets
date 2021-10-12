// const boxen = require('boxen');
const inquirer = require('inquirer');
const chalk = require('chalk');

const PREFIX_PATTERN = /^(\/)?([a-z0-9-_.]+)\/(.*)$/;

module.exports = async () => {
  let done = false;
  const filesToAvoid = [];

  while (!done) {
    const prompt = await inquirer.prompt({
      'type': 'input',
      'name': 'filesToAvoid',
      'message': 'Enter a path to avoid..',
      'suffix': chalk.gray`Press enter to skip`,
      'validate': function (input) {
        if (input == '') {
          return true;
        }

        return PREFIX_PATTERN.test(input) || chalk`Input must match the format {bold /sub1/sub2/.}`;
      }
    });

    if (prompt.filesToAvoid == '') {
      done = true;
    } else {
      filesToAvoid.push({ path: prompt.filesToAvoid });
    }
  }

  return filesToAvoid;
};
