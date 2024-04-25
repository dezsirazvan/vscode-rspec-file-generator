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
            // testType = 'type: :request';
        } else if (filePath.includes('/app/jobs/')) {
            specDir = dirName.replace('/app/jobs', '/spec/jobs');
            specFileName = fileName.replace('.rb', '_spec.rb');
            // testType = 'type: :job';
        } else if (filePath.includes('/app/services/')) {
            specDir = dirName.replace('/app/services', '/spec/services');
            specFileName = fileName.replace('.rb', '_spec.rb');
        } else if (filePath.includes('/app/models/')) {
            specDir = dirName.replace('/app/models', '/spec/models');
            specFileName = fileName.replace('.rb', '_spec.rb');
            // testType = 'type: :model';
        } else if (filePath.includes('/app/graphql/')) {
            handleGraphqlSpecs(filePath, dirName, fileName);
            return; // Early return to prevent further processing
        } else {
            specDir = dirName.replace('/app/', '/spec/');
            specFileName = fileName.replace('.rb', '_spec.rb');
        }

        generateSpecFile(specDir, specFileName, filePath, testType);
    });

    context.subscriptions.push(disposable);
}

function handleGraphqlSpecs(filePath: string, dirName: string, fileName: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fullClassName = getFullClassName(fileContents);
    const baseName = fullClassName || fileName.replace('.rb', '');

    // Unit test for the GraphQL resolver
    const resolverSpecDir = dirName.replace('/app/graphql', '/spec/graphql');
    const resolverSpecFileName = fileName.replace('.rb', '_spec.rb');
    const resolverSpecPath = path.join(resolverSpecDir, resolverSpecFileName);
    createSpecFile(resolverSpecPath, `require 'rails_helper'\n\nRSpec.describe ${baseName} do\nend\n`);

    if ((dirName.includes('/resolvers') && fileName.includes('query')) || dirName.includes('/mutations')) {
        // Integration test for GraphQL
        const requestSpecDir = dirName.replace('/app/graphql', '/spec/requests/graphql').replace('/resolvers', '');
        const requestSpecPath = path.join(requestSpecDir, fileName.replace('.rb', '_spec.rb'));
        createSpecFile(requestSpecPath, `require 'rails_helper'\n\nRSpec.describe '/graphql' do\nend\n`);
    }
}

function createSpecFile(specFilePath: string, content: string) {
    if (!fs.existsSync(specFilePath)) {
        fs.mkdirSync(path.dirname(specFilePath), { recursive: true });
        fs.writeFileSync(specFilePath, content);
        vscode.window.showInformationMessage(`RSpec file created: ${specFilePath}`);
    } else {
        vscode.window.showInformationMessage('RSpec file already exists.');
    }
}

function generateSpecFile(specDir: string, specFileName: string, filePath: any, testType: any) {
    const specFilePath = path.join(specDir, specFileName);
    if (!fs.existsSync(specFilePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const fullClassName = getFullClassName(fileContents);
        const describeBlock = fullClassName || filePath.split(path.sep).pop().replace('.rb', '');
        // fs.writeFileSync(specFilePath, `require 'rails_helper'\n\nRSpec.describe ${describeBlock} ${testType ? `, ${testType} ` : ''}do\nend\n`);
        fs.mkdirSync(path.dirname(specFilePath), { recursive: true });
        fs.writeFileSync(specFilePath, `require 'rails_helper'\n\nRSpec.describe ${describeBlock} do\nend\n`);
        vscode.window.showInformationMessage(`RSpec file created: ${specFilePath}`);
    } else {
        vscode.window.showInformationMessage('RSpec file already exists.');
    }
}

function getFullClassName(fileContents: string) {
    const classMatcher = /module\s+(\w+)|class\s+([\w:]+)/g;
    let match;
    let fullClassName = '';

    while ((match = classMatcher.exec(fileContents)) !== null) {
        const part = match[1] || match[2];
        fullClassName += (fullClassName ? '::' : '') + part;
    }
    // fullClassName = fullClassName.replace('Controller', '');
    return fullClassName;
}
