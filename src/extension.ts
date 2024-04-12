import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateRSpec', async (uri?: vscode.Uri) => {
        if (!uri) {
            let activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                uri = activeEditor.document.uri;
            } else {
                vscode.window.showErrorMessage('No file selected.');
                return;
            }
        }

        const filePath = uri.fsPath;
        const fileName = path.basename(filePath);
        const dirName = path.dirname(filePath);
        const specDir = dirName.replace('/app/', '/spec/');
        const specFileName = fileName.replace('.rb', '_spec.rb');
        const specFilePath = path.join(specDir, specFileName);

        if (!fs.existsSync(specDir)) {
            fs.mkdirSync(specDir, { recursive: true });
        }

        if (!fs.existsSync(specFilePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const fullClassName = getFullClassName(fileContents);
            const describeBlock = fullClassName ? fullClassName : fileName.replace('.rb', '');

            fs.writeFileSync(specFilePath, `require 'rails_helper'\n\ndescribe '${describeBlock}' do\nend`);
            vscode.window.showInformationMessage(`RSpec file created: ${specFilePath}`);
        } else {
            vscode.window.showInformationMessage('RSpec file already exists.');
        }
    });

    context.subscriptions.push(disposable);
}

function getFullClassName(fileContents: string) {
    const classMatcher = /module\s+(\w+)|class\s+([\w:]+)/g;
    let match;
    let fullClassName = '';

    while ((match = classMatcher.exec(fileContents)) !== null) {
        const part = match[1] || match[2];
        fullClassName += (fullClassName ? '::' : '') + part;
    }

    return fullClassName;
}
