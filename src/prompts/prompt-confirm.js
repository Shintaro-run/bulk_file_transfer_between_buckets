const boxen = require('boxen');
const inquirer = require('inquirer');

module.exports = async () => {
  console.log(boxen('You may now make changes to file.csv', {
    padding: 1,
    borderColor: 'green'
  }));

  const waitingForCsvChange = await inquirer.prompt({
    'type': 'confirm',
    'name': 'hasModifiedCsv',
    'message': 'Have you finished making changes to file.csv?'
  });

  return waitingForCsvChange.hasModifiedCsv;
};
