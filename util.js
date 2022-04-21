const fs = require("fs");
const path = require("path");
const fsPromise = fs.promises;

const directoryPath = path.join(__dirname, "entries");

exports.listEntries = async () => {
  try {
    const files = await fsPromise.readdir(directoryPath);
    return files.map((file) => file.slice(0, -3));
  } catch (error) {
    return error.message;
  }
};
exports.saveEntry = async (title, content) => {
  try {
    const filename = `${directoryPath}/${title}.md`;
    await fsPromise.writeFile(filename, content);
  } catch (error) {
    return error.message;
  }
};
exports.getEntry = async (title) => {
  try {
    const path = `${directoryPath}/${title}.md`;
    const content = await fs.promises.readFile(path, "utf8");
    // console.log(content);
    return content;
  } catch (error) {
    return null;
    // console.log(null);
    // console.log(error.message);
  }
};
// saveEntry("t", "sfsafsafsafsaadfsa");
