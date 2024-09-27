import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { promises as fs } from 'fs';
import path from 'path';

export class VomitoriumNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vomitorium',
		name: 'vomitorium',
		icon: 'file:vomitorium-logo.svg',
		group: ['transform'],
		version: 1,
		description: 'Recursively scan directories and process files based on configuration',
		defaults: {
			name: 'Vomitorium',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Scan Directory',
				name: 'scanDirectory',
				type: 'string',
				default: '.',
				description: 'Directory to scan. Defaults to current working directory.',
			},
			{
				displayName: 'Include Directories',
				name: 'includeDirectories',
				type: 'string',
				default: '',
				description: 'Comma-separated list of directories to include',
			},
			{
				displayName: 'Exclude Patterns',
				name: 'excludePatterns',
				type: 'string',
				default: 'node_modules,.git,dist,build',
				description: 'Comma-separated list of directories or files to exclude',
			},
			{
				displayName: 'File Extensions',
				name: 'extensions',
				type: 'string',
				default: '.js,.ts,.json',
				description: 'Comma-separated list of file extensions to include',
			},
			{
				displayName: 'Show Excluded',
				name: 'showExcluded',
				type: 'boolean',
				default: true,
				description: 'Whether to show excluded files in the output',
			},
			{
				displayName: 'Show Skipped',
				name: 'showSkipped',
				type: 'boolean',
				default: true,
				description: 'Whether to show skipped files without listing their contents',
			},
			{
				displayName: 'Output File',
				name: 'outputFile',
				type: 'string',
				default: 'vommit.txt',
				description: 'Specify the output file name',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const scanDirectory = this.getNodeParameter('scanDirectory', 0) as string;
		const includeDirectories = (this.getNodeParameter('includeDirectories', 0) as string).split(',');
		const excludePatterns = (this.getNodeParameter('excludePatterns', 0) as string).split(',');
		const extensions = (this.getNodeParameter('extensions', 0) as string).split(',');
		const showExcluded = this.getNodeParameter('showExcluded', 0) as boolean;
		const showSkipped = this.getNodeParameter('showSkipped', 0) as boolean;
		const outputFile = this.getNodeParameter('outputFile', 0) as string;

		const finalScanDir = scanDirectory;
		const finalIncludeDirs = includeDirectories;
		const finalExcludePatterns = excludePatterns;
		const finalExtensions = extensions;

		const outputFilePath = path.resolve(outputFile);

		/**
		 * Checks if a file should be excluded based on the excludePatterns.
		 * @param {string} filePath - The path of the file to check.
		 * @returns {boolean} True if the file should be excluded, false otherwise.
		 */
		function isExcluded(filePath: string): boolean {
			const relativePath = path.relative(process.cwd(), filePath);
			return finalExcludePatterns.some(pattern => {
				return relativePath.includes(pattern) || path.basename(filePath) === pattern;
			});
		}

		/**
		 * Recursively traverses a directory and processes its files.
		 * @param {string} dirPath - The path of the directory to traverse.
		 * @returns {Promise<void>}
		 */
		async function traverseDirectory(dirPath: string): Promise<void> {
			const files = await fs.readdir(dirPath, { withFileTypes: true });

			for (const file of files) {
				const fullPath = path.join(dirPath, file.name);

				if (isExcluded(fullPath)) {
					if (showExcluded) {
						await logSkippedFile(fullPath, 'Excluded');
					}
					continue;
				}

				if (file.isDirectory()) {
					if (finalIncludeDirs.length === 0 || finalIncludeDirs.some(d => fullPath.includes(d))) {
						await traverseDirectory(fullPath);
					}
				} else {
					const ext = path.extname(file.name);

					if (!finalExtensions.includes(ext)) {
						if (showSkipped) {
							await logSkippedFile(fullPath, 'Skipped (non-matching extension)');
						}
						continue;
					}

					await processFile(fullPath);
				}
			}
		}

		/**
		 * Processes a single file, reading its content and appending it to the output file.
		 * @param {string} filePath - The path of the file to process.
		 * @returns {Promise<void>}
		 */
		async function processFile(filePath: string): Promise<void> {
			const fileContent = await fs.readFile(filePath, 'utf-8');
			const relativePath = path.relative(process.cwd(), filePath);

			await fs.appendFile(outputFilePath, `\n\n--- File: ${relativePath} ---\n\n${fileContent}\n`);
		}

		/**
		 * Logs a skipped file to the output file.
		 * @param {string} filePath - The path of the skipped file.
		 * @param {string} reason - The reason for skipping the file.
		 * @returns {Promise<void>}
		 */
		async function logSkippedFile(filePath: string, reason: string): Promise<void> {
			const relativePath = path.relative(process.cwd(), filePath);
			await fs.appendFile(outputFilePath, `\n\n--- File: ${relativePath} ---\n(${reason})\n`);
		}

		try {

			await fs.access(finalScanDir);
			await fs.writeFile(outputFilePath, '');
			await traverseDirectory(finalScanDir);

		} catch (err) {
			throw new NodeOperationError(
				this.getNode(),
				`Error: Directory "${finalScanDir}" does not exist or is inaccessible.`);
		}

		return this.prepareOutputData([]);
	}
}
