# RSpec File Generator README

Welcome to the RSpec File Generator extension for Visual Studio Code! This tool is designed to boost the efficiency of Ruby on Rails developers by automating the creation of RSpec test files directly from the VS Code interface with just a right-click.

## Features

This extension provides a seamless experience for generating RSpec test files:

- **Context Menu Integration**: Right-click any Ruby file and select "Generate RSpec File" to create a corresponding test file in the `spec` directory with the `_spec.rb` suffix.
- **Automatic Directory Management**: Automatically creates any necessary directories in the `spec` path to maintain the standard Rails directory structure.
- **Notification Feedback**: Receive immediate notification feedback on successful file creation or if the file already exists.

For example, here's how you can use the extension in action:

![Generate Rspec](demo.mov)

## Requirements

This extension requires:
- Visual Studio Code 1.50.0 or higher
- Ruby on Rails environment set up in the workspace

## Extension Settings

This extension contributes the following settings:
- `rspecFileGenerator.enable`: Enable/disable this feature.
- `rspecFileGenerator.createSpecDirectory`: Automatically create spec directory if it does not exist.

## Known Issues

Currently, there are no known issues. Should any arise, they will be listed here to help avoid duplicate issue reporting.

## Release Notes

### 1.0.0

- Initial release of RSpec File Generator.
- Full functionality for generating RSpec files with context menu integration.

### 1.0.1

- Fixed minor bugs related to file path resolutions.

### 1.1.0

- Added support for custom configurations via extension settings.

---

## Following Extension Guidelines

Ensure you've read through the [extension guidelines](https://code.visualstudio.com/api/references/extension-guidelines) and adhere to best practices for creating your extension.

## Working with Markdown

Markdown is supported natively in Visual Studio Code. Useful shortcuts:
- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For More Information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy your streamlined Rails testing workflow with the RSpec File Generator!**
