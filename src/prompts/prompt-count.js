const inquirer = require('inquirer');

module.exports = async () => {
  const prompt = await inquirer.prompt({
    'type': 'number',
    'name': 'number',
    'message': 'Enter the number of files..',
  });


  return prompt.number;
};
