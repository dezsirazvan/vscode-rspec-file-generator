// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.generateRSpec', (uri: vscode.Uri) => {
		const filePath = uri.fsPath;
		const fileName = path.basename(filePath);
		const dirName = path.dirname(filePath);
	
		// Assuming the code files are in 'app' and specs should be in 'spec'
		const specDir = dirName.replace('/app/', '/spec/');
		const specFileName = fileName.replace('.rb', '_spec.rb');
		const specFilePath = path.join(specDir, specFileName);
	
		// Create spec directory if it doesn't exist
		if (!fs.existsSync(specDir)) {
			fs.mkdirSync(specDir, { recursive: true });
		}
	
		// Create the spec file if it doesn't exist
		if (!fs.existsSync(specFilePath)) {
			fs.writeFileSync(specFilePath, `require 'rails_helper'\n\ndescribe ${fileName.replace('.rb', '')} do\nend`);
			vscode.window.showInformationMessage(`RSpec file created: ${specFilePath}`);
		} else {
			vscode.window.showInformationMessage('RSpec file already exists.');
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
