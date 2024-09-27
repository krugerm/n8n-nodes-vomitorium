# n8n-nodes-vomitorium

## Overview

The Vomitorium Node is a custom node for n8n that recursively scans directories, processes files based on configurable criteria, and writes the contents to an output file. This node is based on the `vomitorium` project [https://github.com/JWally/vomitorium] and is designed to be integrated into n8n workflows to automate LLM file processing tasks.

## Features

The Vomitorium node supports the following operations:

- **Directory Scanning**: Recursively scans directories and process files starting from a specified root path.
- **Include/Exclude Patterns**: Configurable patterns to include or exclude certain directories and files from processing.
- **File Extension Filtering**: Process files with specific extensions only.
- **Output Control**: Optionally log excluded and skipped files, and write processed file contents to a specified output file.

[Installation](#installation)
[Configuration](#configuration)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Configuration

The Vomitorium Node supports configuration through the node properties.

- **Scan Directory**: Set the directory to start scanning. Defaults to the current working directory (`.`).
- **Include Directories**: Specify a comma-separated list of directories to include in the scan.
- **Exclude Patterns**: Specify a comma-separated list of directories or files to exclude from the scan.
- **File Extensions**: Specify a comma-separated list of file extensions to include for processing (e.g., `.js,.ts,.json`).
- **Show Excluded**: Toggle whether to show excluded files in the output.
- **Show Skipped**: Toggle whether to show skipped files without listing their contents.
- **Output File**: Specify the name of the output file where processed contents will be written.

Example Configuration:

```txt
scan: './src',
include: ['lib', 'tests'],
exclude: ['node_modules', '.git', 'dist'],
extensions: ['.js', '.ts', '.json'],
showExcluded: true,
showSkipped: true,
outputFile: 'vomit.txt',
```

## Compatibility

- Tested against: n8n versions 1.60.1

## Resources

- [Vomitorium](https://github.com/JWally/vomitorium)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version history

- **1.0.0**: Initial release of the Vomitorium node.

## Acknowledgements

This project was copied from the original `vomitorium` project and adapted for use in n8n.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
