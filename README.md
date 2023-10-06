# Guide

Tome is a simple tool to compile multiple markdown files into a single html document.

## Features

- Compile an entire file hierarchy into a single html document.
- Ignore non-valid file types.
- Strip html comments.
- "Outline Notes" - Strip headings tagged with '@'. This allows the use of outline headings in a text editor with an outliner view, while stripping them from the final output.

## Installation

This script requires [nodejs](https://nodejs.org/). 

Before running, install the required node packages with the command:

`npm install -g`  

This will add the `tome` CLI command to your terminal.

## Usage

The `tome` command can be called with zero, one, or two arguments.

### No Arguments: 

`tome`

Called without arguments, this version just looks for the `tome.json` file, and if it doesn't exist, it does NOTHING.

### One Argument

If one argument is supplied, tome interprets this as a source file or directory. The output file will be saved alongside the source file or directory, using the same name as the source, with the new suffix `.html`.

`tome source-file.md`  
`tome directory-name`  

### Two Argument

If two arguments are supplied, the source file or directory will be parsed and saved to the destination path.

`tome source-file.md manuscript.html`   
`tome directory-name manuscript.html`   

### Configuring a Project with `tome.js`

Configure a project by placing a file called `tome.json` in the project root directory. This determines the source and output files:
```
[
  {
    "source": "/manuscript",
    "outputFile": "/www/compiled_document.html",
    "title: ": "Example Document"
  }
]
```

`source` - the source file or the directory structure to be compiled.  
`outputFile` - the destination file where the output should be saved.  
`title` - The title string to be injected into the output html `<title>` tag.

### Compiling with `tome.js`

To compile the output file, simply run the `tome` command in the same directory as the `tome.json` file.

### Multiple Jobs

Note that it is possible to define multiple jobs within a single project:

```
[
  {
    "source": "/doc1",
    "outputFile": "/www/compiled_document1.html",
    "title: ": "Example Document 1"
  },
  {
    "source": "/doc2",
    "outputFile": "/www/compiled_document2.html",
    "title: ": "Example Document 2"
  }
  ,
  {
    "source": "source-file.md",
    "outputFile": "/www/compiled_document3.html",
    "title: ": "Example Document 3"
  }
]
```

### Valid Input Files

Only `.md` and `.txt` files are included in the final output. All other file types will be ignored. 

### Outline Notes

Some text editors that feature an "Outliner" that displays markdown headers in a sidebar for easy access.

![Outliner in Sublime Text](/doc/img/outliner_notes.jpg)
*(Above: The outliner sidebar from VS Code)*

The Outline Notes feature allows users to display notes and section descriptions in the outliner without including them in the final document.

Any header that starts with an @ symbol will be stripped.

*Example format:*
```
  # @ Outliner Note will be stripped
  ## @ Outliner Note will be stripped
  ### @ Outliner Note will be stripped
```     
