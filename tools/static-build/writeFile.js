import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import mkdirp from 'mkdirp';

const writeFile = Promise.promisify(fs.writeFile);
const createFolder = Promise.promisify(mkdirp);

export default (filePath, fileContent) => {
  const { dir } = path.parse(filePath);
  return createFolder(dir).then(() => writeFile(filePath, fileContent));
};
