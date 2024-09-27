# Vomitorium Node for n8n

## Overview

The Vomitorium Node is a custom node for n8n that recursively scans directories, processes files based on configurable criteria, and writes the contents to an output file. This node is inspired by the `vomitorium` project [https://github.com/JWally/vomitorium] and is designed to be integrated into n8n workflows to automate LLM file processing tasks.

## Features

- **Directory Scanning**: Recursively scans directories starting from a specified root path.
- **Include/Exclude Patterns**: Configurable patterns to include or exclude certain directories and files from processing.
- **File Extension Filtering**: Process only files with specific extensions.
- **Output Control**: Optionally log excluded and skipped files, and write processed file contents to a specified output file.
- **Custom Configuration**: Supports configuration through node properties or a `cosmiconfig` configuration file.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/krugerm/n8n-vomitorium-node.git
   cd n8n-vomitorium-node
   ```

2. **Build the Project:**

   Ensure you have Node.js installed.

   ```bash
   npm install
   npm run build
   ```

3. **Add to n8n:**

   Copy the compiled node to your n8n custom nodes directory. The exact location may vary depending on your n8n setup. Typically, you would place it under the `nodes` directory of your n8n instance.

   ```bash
   cp -r dist /path/to/your/n8n/custom/nodes/
   ```

4. **Restart n8n:**

   Restart your n8n instance to load the new node.

   ```bash
   n8n start
   ```

## Usage

Once the Vomitorium Node is added to your n8n instance, you can use it in your workflows as follows:

1. **Add the Node:**
   Drag and drop the Vomitorium Node into your workflow.

2. **Configure the Node:**

   - **Scan Directory**: Set the directory to start scanning. Defaults to the current working directory (`.`).
   - **Include Directories**: Specify a comma-separated list of directories to include in the scan.
   - **Exclude Patterns**: Specify a comma-separated list of directories or files to exclude from the scan.
   - **File Extensions**: Specify a comma-separated list of file extensions to include for processing (e.g., `.js,.ts,.json`).
   - **Show Excluded**: Toggle whether to show excluded files in the output.
   - **Show Skipped**: Toggle whether to show skipped files without listing their contents.
   - **Output File**: Specify the name of the output file where processed contents will be written.

3. **Run the Workflow:**
   Execute the workflow, and the Vomitorium Node will process files according to the configuration, logging its activities and writing results to the output file.

## Configuration

The Vomitorium Node supports configuration through the node properties or a `vomitorium` configuration file using `cosmiconfig`. The configuration file can be in JSON, YAML, or JavaScript format, and should be placed in your project root.

### Example Configuration File (`vomitorium.config.js`)

```javascript
module.exports = {
	scan: './src',
	include: ['lib', 'tests'],
	exclude: ['node_modules', '.git', 'dist'],
	extensions: ['.js', '.ts', '.json'],
	showExcluded: true,
	showSkipped: true,
	outputFile: 'output.sick',
};
```

## Development

### Prerequisites

- Node.js (v14 or later)
- n8n setup (with custom nodes enabled)

### Building the Project

After cloning the repository, run:

```bash
npm install
npm run build
```

### Testing

To test the node, you can use the `npm link` feature to link the package to your n8n installation for development purposes:

```bash
npm link
cd /path/to/your/n8n/
npm link n8n-vomitorium-node
n8n start
```

This will allow you to test the node directly within your n8n instance.

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

This project was inspired by the original `vomitorium` script and adapted for use in n8n.
