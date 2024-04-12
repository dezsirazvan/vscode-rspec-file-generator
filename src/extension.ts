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
        let specDir, specFileName, specFilePath, testType;

        if (filePath.includes('/app/controllers/')) {
            specDir = dirName.replace('/app/controllers', '/spec/requests');
            specFileName = fileName.replace('_controller.rb', '_spec.rb');
            testType = 'type: :request';
        } else if (filePath.includes('/app/jobs/')) {
            specDir = dirName.replace('/app/jobs', '/spec/jobs');
            specFileName = fileName.replace('.rb', '_spec.rb');
            testType = 'type: :job';
        } else if (filePath.includes('/app/services/')) {
            specDir = dirName.replace('/app/services', '/spec/services');
            specFileName = fileName.replace('.rb', '_spec.rb');
            testType = '';
        } else if (filePath.includes('/app/models/')) {
            specDir = dirName.replace('/app/', '/spec/');
            specFileName = fileName.replace('.rb', '_spec.rb');
            testType = 'type: :model';
        } else {
            specDir = dirName.replace('/app/', '/spec/');
            specFileName = fileName.replace('.rb', '_spec.rb');
            testType = '';
        };

        specFilePath = path.join(specDir, specFileName);

        if (!fs.existsSync(specDir)) {
            fs.mkdirSync(specDir, { recursive: true });
        }

        if (!fs.existsSync(specFilePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const fullClassName = getFullClassName(fileContents);
            const describeBlock = fullClassName || fileName.replace('.rb', '');

            fs.writeFileSync(specFilePath, `require 'rails_helper'\n\nRSpec.describe ${describeBlock}, ${testType ? `${testType} ` : ''}do\nend`);
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

    fullClassName = fullClassName.replace('Controller', '');

    return fullClassName;
}
