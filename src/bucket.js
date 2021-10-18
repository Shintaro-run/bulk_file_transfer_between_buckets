const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

async function listFiles(bucket, path) {
  const bucketInstance = storage.bucket(bucket);

  const [files] = await bucketInstance.getFiles({
    prefix: path
  });

  return files
    .map(file => {
      return {
        name: file.name.replace(path, '')
      };
    })
    .filter(file => {
      return file.name != '' && file.name != '/';
    });
}

async function checkExistance(bucket, file) {
  const bucketInstance = storage.bucket(bucket);
  const fileInstance = bucketInstance.file(file);
  const [exists] = await fileInstance.exists();

  return {
    object: fileInstance.name,
    exists
  };
}

function verifyFiles(source, files) {
  const bucketInstance = storage.bucket(source.bucket);

  return new Promise(async (resolve, reject) => {
    for (const file of files) {
      try {
        const [exists] = await bucketInstance.file(`${source.path}${file.name}`).exists();

        if (!exists) {
          return resolve(false);
        }
      } catch (error) {
        reject(error.message);
      }
    }

    return resolve(true);
  });

}

async function copyFile(source, fileName, destination) {
  const destinationFile = storage
    .bucket(destination.bucket)
    .file(`${destination.path}${fileName}`);

  const [file, metadata] = await storage
    .bucket(source.bucket)
    .file(`${source.path}${fileName}`)
    .copy(destinationFile);

  return file;
}

async function moveFile(source, fileName, destination) {
  const destinationFile = storage
    .bucket(destination.bucket)
    .file(`${destination.path}${fileName}`);

  const [file, metadata] = await storage
    .bucket(source.bucket)
    .file(`${source.path}${fileName}`)
    .move(destinationFile);

  return file;
}

module.exports = {
  listFiles,
  checkExistance,
  verifyFiles,
  copyFile,
  moveFile
};
