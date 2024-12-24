// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChildProcess, exec } from "child_process";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
let open: any;
import("open").then((module) => {
	open = module.default;
});

let server: ChildProcess | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const port = 8080;
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
			try {
				process.chdir(buildPath);
				console.log("Directory changed to:", process.cwd()); // 输出新的工作目录
				exec("http-server --version", (error) => {
					if (error) {
						vscode.window.showInformationMessage("http-server not found. Installing...");
						installAndRunHttpServer();
					} else {
						vscode.window.showInformationMessage("http-server is already installed.");
						startHttpServer();
					}
				});
			} catch (error: any) {
				console.error("Failed to change directory:", error.message);
			}

		});
	}
	);


	context.subscriptions.push(disposable);

	function installAndRunHttpServer() {
		exec("npm install -g http-server", (error) => {
			if (error) {
				vscode.window.showErrorMessage("Failed to install http-server.");
			} else {
				vscode.window.showInformationMessage("http-server installed successfully.");
				startHttpServer();
			}
		});
	}

	function startHttpServer() {


		server = exec(`http-server -p ${port}`, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage("Failed to start http-server:", stderr);
				return;
			}
			vscode.window.showInformationMessage(`http-server is running at http://localhost:${port}`);
			open(`http://localhost:${port}`).catch((err: unknown) => {
				vscode.window.showInformationMessage(`Failed to open browser: ${String(err)}`);
			});
		});

		server.on("close", () => {
			vscode.window.showInformationMessage("Server stopped.");
		});

	}
}