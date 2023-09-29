#!/usr/bin/env node

var markdown = require( "markdown" ).markdown;
var fs = require('fs');
const path = require("path")

const configPath = "./tome.json";

var validFileExtensions = ["md", "txt"];
  
var htmlHead = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{title}</title>
<!--  
<link rel="stylesheet" href="reset.css">
-->
  <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="main-content">
`;

var htmlTail = `
    </div>
</body>
</html>
`;

const tableHead = `<table style="width:100%;" valign="top">`;
const tableTail = `</table>`;

const tdHead = `<td valign="top" style="width:{width_style}">`;
const tdTail = '</td>';

const trHead = '<tr>';
const trTail = '</tr>';

const argv = process.argv;

var jobs = null;

// Check to see if there are any commandline arguments, and attempt to
// interpret them as input and output filenames
if (argv.length >= 3  ) {

  var commands = argv.slice(2);
  var pathToSourceDir =  "/";// process.cwd();
  var pathToOutputFile = "/" + commands[0];
  
  if (fs.existsSync(pathToSourceDir)) {

      jobs = [];
      jobs.push({
        rootDir: pathToSourceDir,
        outputFile: pathToOutputFile
      });

  } else {
    console.log("Path does not exist:", pathToSourceDir);
    process.exit();
  }
}

// if the jobs were not derived from the CLI arguments, 
// we will attempt to load the config tile
if (jobs == null) {

  // check if the config file exists
  if (!fs.existsSync(configPath)) {
      console.log("Error - ", configPath, " was not found.");
      process.exit();
  }

  // Load the config
  var config = fs.readFileSync(configPath);
  jobs = JSON.parse(config);
}


/// MAIN Execution //////
jobs.forEach( (job) => {    

    var data = "";
    var root = process.cwd() + job.rootDir;
    
    files = getAllFiles(root);

    var documentContents = [];

    files.forEach((file) => {
       
        if (!fs.existsSync(file)) {
          // NOTE: this should be impossible, since we got the filenames
          // by querying the file listing
          console.log("File does not exist:", file);
          return;
        }

        var fileContent = fs.readFileSync(file);
        // NOTE / TODO: Should check to see if there is a newline
        // and only add one if there isn't?
        // (Or is it always necessary?)
        documentContents.push(fileContent + '\n');
    });

    // Strip lines that are unwanted
    var combinedTexts = documentContents.join('');
    combinedTexts = stripHtmlComments(combinedTexts);

    // split into individual lines so we can remove unwanted ones
    var lines = combinedTexts.split("\n");
    var outputLines = [];

    lines.forEach(line => {
      // skip "outline notes" 
      if (isOutlineNote(line)) {
        return;
      }
      outputLines.push(line);
    });

    combinedTexts = outputLines.join('\n');

    const compiled = parse(combinedTexts, job.title || "");

    var outputFileFullPath = process.cwd() + job.outputFile;

    // clean the path
    outputFileFullPath = path.resolve(outputFileFullPath);

    // Check if we are overwriting one of the source files!
    // (This mode is dangerous, because the output file may be
    // inside the scope of the source files)
    // so we will check to make sure nobody accidentally overwrites one
    // of the source files!
    files.forEach(f => {
      if (outputFileFullPath == path.resolve(f)) {
        console.log("cannot overwrite one of the source files!");
        process.exit();
      }
    });

    ensureDirectoryExistence(outputFileFullPath);

    fs.writeFileSync(outputFileFullPath, compiled);

    console.log("Finished:", job.title || job.rootDir);
});

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function stripHtmlComments(content) {
    return content.replace(/<!--(?!>)[\S\s]*?-->/g, '');
}

function isHiddenPath(path) {
    return (/(^|\/)\.[^\/\.]/g).test(path);
}

function hasValidFileExtension(path) {
  for (let i = 0; i < validFileExtensions.length; i++) {
    const extension = validFileExtensions[i];
    if (path.endsWith(extension)) {
      return true;
    }
  }
  return false;
}

function getAllFiles(dirPath, arrayOfFiles) {

    files = fs.readdirSync(dirPath);
  
    arrayOfFiles = arrayOfFiles || [];
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        var fullPath = path.join(dirPath, "/", file);
        if (
          !isHiddenPath(fullPath)
          && hasValidFileExtension(fullPath)
        ) {
            arrayOfFiles.push(fullPath);
        }
      }
    })
  
    return arrayOfFiles;
}

function parse(data, title = "") {
    // parse the markdown of the remaining text
    var finalOutput = markdown.toHTML(data);

    var customHtmlHead = htmlHead.replace("{title}", title);

    // add html head and tail
    finalOutput = [customHtmlHead, finalOutput, htmlTail].join("");

    return finalOutput;
}

function removeAllWhitespace(s) {
  return s.replace(/\s+/g, '');
}

function changeSuffix(filePath, newSuffix) {
  var suffix = path.extname(filePath);
  var newPath = filePath.substring(0, filePath.length - suffix.length)
      + "." + newSuffix;
  return newPath;
}

function isOutlineNote(s) {
  // if it's not a hash, then it's not an outline note
  if (s[0] != '#') {
      return false;
  }
  // find the first character that isn't a hash or a space
  // and if it's an `@`, it's an Outline Note
  for (var i = 1; i < s.length; i++) {
      var c = s[i];
      if (c != "#" && c != " ") {
          return c == '@';
      }
  }
}
