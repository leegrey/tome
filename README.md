# Guide

Tome is a simple tool to compile miltiple markdown files into a single html document.

## Features

- Compile an entire file hierarchy into a single html document.
- Ignore non-valid file types.
- Strip html comments.
- "Outline Notes" - Strip headings tagged with '@'. This allows the use of outline headings in a text editor with an outliner view, while stripping them from the final output.

## Installation

This script requres [nodejs](https://nodejs.org/). 

Before running, install the required node packages with the command:

`npm install -g`  

This will add the `tome` CLI command to your terminal.

## Usage

### Configure a Project with `tome.js`

Configure a project by placing a file called `tome.json` in the project root directory. This determines the source and output files, and the html title:
```
[
  {
    "rootDir": "/manuscript",
    "outputFile": "/www/compiled_document.html",
    "title: ": "Example Document"
  }
]
```

`rootDir` - the root of the directory structure to be compiled.  
`outputFile` - the destination file where the output should be saved.  
`title` - the title of the output html document.  

### Compiling

To compile the output file, simply run the `tome` command in the same directory as the `tome.json` file.

### Multiple Jobs

Note that it is possible to define multiple jobs:

```
[
  {
    "rootDir": "/doc1",
    "outputFile": "/www/compiled_document1.html",
    "title: ": "Example Document 1"
  },
  {
    "rootDir": "/doc2",
    "outputFile": "/www/compiled_document2.html",
    "title: ": "Example Document 2"
  }
]
```

### Usage without `tome.js`:

Calling `tome` with only one argument will compile the current working directory, and save to the supplied output file path:

`tome outputfilename.html`

Note that if you supply an output file name that would overwrite one of the source files, the output file will not be saved. 

### Valid Input Files

Only `.md` and `.txt` files are included in the final output.
