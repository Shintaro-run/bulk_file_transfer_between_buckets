const ora = require('ora');
const ProgressBar = require('progress');
const pLimit = require('p-limit');

const {
  listFiles,
  copyFile,
  moveFile,
  checkExistance } = require('./bucket');
const { writeToCsv, readFromCsv, writeToCsvAvoid, readFromCsvAvoid } = require('./csv');

const promptSource = require('./prompts/prompt-source');
const promptDestination = require('./prompts/prompt-destination');
const promptConfirm = require('./prompts/prompt-confirm');
const promptOperation = require('./prompts/prompt-operation');
const promptAvoid = require('./prompts/prompt-avoid');

const limit = pLimit(100);
const spinner = ora({ discardStdin: true });

module.exports = async () => {
  try {
    const source = await promptSource();

    spinner.start('Listing files');
    let sourceFileList = await listFiles(source.bucket, source.path);

    if (sourceFileList.length <= 0) {
      throw new Error('No files found in source');
    }
    spinner.succeed(`${sourceFileList.length} files found in ${source.fullPath}`);

    spinner.start('Writing to CSV');
    const csvWriteStatus = await writeToCsv(sourceFileList);
    // const csvWriteStatusAvoid = await writeToCsvAvoid();

    if (!csvWriteStatus) {
      throw new Error('Unable to write file.csv.');
    }
    spinner.succeed('Created CSV successfully');

    const changed = await promptConfirm();
    if (!changed) return;

    spinner.start('Reading from CSV');
    let filesToOperatePreFilter = await readFromCsv();
    spinner.stop();

    let filesToAvoidPromptAnswers = await promptAvoid();
    const csvWriteStatusAvoid = await writeToCsvAvoid(filesToAvoidPromptAnswers);
    if (!csvWriteStatusAvoid) {
      throw new Error('Unable to write files-to-avoid.csv.');
    }
    const filesToAvoid = await readFromCsvAvoid();

    let filesToOperate = filesToOperatePreFilter.filter(item => {
      const file = item.name;

      for (let index = 0; index < filesToAvoid.length; index++) {
        const path = filesToAvoid[index].path;
        if (file.startsWith(path)) {
          return false;
        }
      }

      return true;
    });

    if (filesToOperate.length <= 0) {
      throw new Error('There are no files to operate');
    } else {
      spinner.succeed(`CSV loaded successfully. Working on ${filesToOperate.length} files.`);
    }

    try {
      spinner.start('Verifying files');

      let counter = 0;

      const promises = filesToOperate.map(file => limit(async () => {
        const existence = await checkExistance(source.bucket, source.path + file.name);

        if (!existence.exists) {
          throw new Error(`gs://${source.bucket}/${existence.object} does not exist.`);
        }

        spinner.text = `Verifiying ${existence.object} (${++counter}/${filesToOperate.length})`;

        return existence;
      }));

      await Promise.all(promises);

      spinner.succeed(`Existence of ${filesToOperate.length} files verified!`);
    } catch (error) {
      spinner.fail('Unable to verify: ' + error.message);
      process.exit(1);
    }

    const operation = await promptOperation();
    const destination = await promptDestination();

    try {
      spinner.info(operation == 'copy' ? 'Copying' : 'Moving');

      const progress = new ProgressBar('[:bar] :rate files/second - :percent :etas', {
        total: filesToOperate.length,
        width: 30
      });

      const operationPromises = filesToOperate.map(file => limit(async () => {
        let task = null;

        if (operation == 'copy') {
          task = await copyFile(source, file.name, destination);
        } else if (operation == 'move') {
          task = await moveFile(source, file.name, destination);
        }

        progress.tick();
        return task;
      }));

      await Promise.all(operationPromises);

      spinner.succeed('Operation successful');
    } catch (error) {
      spinner.fail('An error occured while performing the operations.');
      console.trace(error);
      process.exit(1);
    }

  } catch (error) {
    spinner.fail(error.message);
  }
};
