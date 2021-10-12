const inquirer = require('inquirer');

module.exports = async (projectName, projectId) => {
  const confirmProject = await inquirer.prompt({
    'type': 'confirm',
    'name': 'project',
    'message': 'A CSV was generated. Please confirm if you would like to continue.'
  });

  return waitingForCsvChange.hasModifiedCsv
};
