// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from "child_process";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
let open: any;
import("open").then((module) => {
	open = module.default;
});

let server: http.Server | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutter-web-deploy" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('extension.buildAndServeFlutterWeb', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage("No workspace folder found.");
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;
		const buildPath = path.join(projectPath, "build", "web");
		const port = 8080;
		vscode.window.showInformationMessage('Building Flutter Web...');
		exec("flutter build web", { cwd: projectPath }, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage(`Build failed: ${stderr}`);
				return;
			}

			vscode.window.showInformationMessage("Build succeeded!");

			if (!fs.existsSync(buildPath)) {
				vscode.window.showErrorMessage(
					`Build output not found at ${buildPath}`
				);
				return;
			}

			if (server) {
				server.close();
			}

			server = http.createServer((req, res) => {
				const filePath = path.join(buildPath, req.url || "index.html");
				fs.readFile(filePath, (err, data) => {
					if (err) {
						res.writeHead(404);
						res.end("404 Not Found");
					} else {
						res.writeHead(200);
						res.end(data);
					}
				});
			});

			server.listen(port, () => {
				vscode.window.showInformationMessage(
					`Serving at http://localhost:${port}`
				);
				open(`http://localhost:${port}`);
			});
		});
	}
	);


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (server) {
		server.close();
	}
}
