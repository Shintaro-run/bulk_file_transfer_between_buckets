const inquirer = require('inquirer');

module.exports = async () => {
  const operationPrompt = await inquirer.prompt({
    'type': 'list',
    'name': 'operation',
    'message': 'Specify the operation you would like to perform',
    'choices': ['move', 'copy']
  });

  return operationPrompt.operation;
};
