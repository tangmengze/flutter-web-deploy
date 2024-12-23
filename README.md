# Flutter Web Deploy

Flutter Web Deploy is a VS Code extension that automates the process of building Flutter Web projects, deploying them to a local server, and opening the result in your default browser. This extension aims to streamline the development workflow for Flutter Web developers.

## Features

- Build Flutter Web projects with ease.
- Start a local server to serve the built project.
- Automatically open the browser to preview the app.
- Works seamlessly with any Flutter Web project.

## Usage

1. Open a Flutter project in VS Code.
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3. Run the command: **Build and Serve Flutter Web**.
4. The extension will:
   - Build the Flutter Web project.
   - Start a local server at `http://localhost:8080`.
   - Open the app in your default browser.

## Requirements

- **Flutter**: Ensure Flutter is installed and accessible via the `flutter` command in your terminal.
- **Dart SDK**: Dart should be properly configured in your Flutter environment.

## Known Issues

- The extension currently supports only one workspace at a time.
- If the `flutter` command is not in your PATH, the extension will not work.

## Release Notes

### 1.0.0

Initial release of Flutter Web Deploy.

## License

MIT
