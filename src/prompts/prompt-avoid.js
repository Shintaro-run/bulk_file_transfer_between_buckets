// const boxen = require('boxen');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { listFiles } = require('../bucket');

const GS_PATTERN = /^gs:\/\/([a-z0-9-_.]+)\/(.*)$/;

module.exports = async () => {
  let done = false;
  const filesToAvoid = [];

  while (!done) {
    const prompt = await inquirer.prompt({
      'type': 'input',
      'name': 'url',
      'message': 'Enter a path to avoid..',
      'suffix': chalk.gray`Press enter to skip`,
      'validate': function (input) {
        if (input == '') {
          return true;
        }

        return GS_PATTERN.test(input) || chalk`Input must match the format {bold gs://bucket/path/.}`;
      }
    });

    if (prompt.url == '') {
      done = true;
    } else {
      const gsUrl = GS_PATTERN.exec(prompt.url);

      const files = await listFiles(gsUrl[1], gsUrl[2]);
      files.map(file => {
        filesToAvoid.push(file);
      });
    }
  }

  return filesToAvoid;
};
