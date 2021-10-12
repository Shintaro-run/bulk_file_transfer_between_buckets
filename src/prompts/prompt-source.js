const inquirer = require('inquirer');
const chalk = require('chalk');

const GS_PATTERN = /^gs:\/\/([a-z0-9-_.]+)\/(.*)$/;

module.exports = async () => {
  const prompt = await inquirer.prompt({
    'type': 'input',
    'name': 'url',
    'message': 'Enter the source directory',
    'default': 'gs://ws-p1-sb/sub1/sub2/',
    'validate': function (input) {
      return GS_PATTERN.test(input) || chalk`Input must match the format {bold gs://bucket/path/.}`;
    }
  });

  const gsUrl = GS_PATTERN.exec(prompt.url);

  return {
    fullPath: gsUrl[0],
    bucket: gsUrl[1],
    path: gsUrl[2]
  };
};
