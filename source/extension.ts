import { window, commands, workspace } from "vscode";
import { ExtensionContext } from "vscode";
import { exec as executeChildProcess } from "child_process";

const versionBumpTypes: Array<string> = [
  "Major",
  "Minor",
  "Patch",
  "Pre-Major",
  "Pre-Minor",
  "Pre-Patch",
  "Pre-Release",
];

function addContextSubscriptions(context: ExtensionContext) {
  const statusBarItem = window.createStatusBarItem();
  statusBarItem.text = "$(versions) Bump";
  statusBarItem.tooltip = "Bump Npm Package Version";
  statusBarItem.command = "bump-npm-package-version";
  statusBarItem.show();
  const command = commands.registerCommand(
    "bump-npm-package-version",
    handleOnBumpNpmPackageVerisonCommand
  );
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(command);
}

async function handleOnBumpNpmPackageVerisonCommand() {
  // Check if user is in a workspace
  if (
    workspace.workspaceFolders === undefined ||
    workspace.workspaceFolders.length === 0
  ) {
    return;
  }

  try {
    // Show bump version menu
    let picked = await window.showQuickPick(versionBumpTypes);

    if (picked === undefined) {
      return;
    }

    picked = picked.toLowerCase().replace("-", "");

    // Prepare command & arguments
    let command = `npm version ${picked}`;

    // pre-id
    if (picked === "prerelease") {
      const preid = await window.showInputBox({
        placeHolder: "Pre-Release Identifier",
      });

      if (preid !== undefined && /^[a-zA-Z]+$/.test(preid)) {
        command += ` --preid="${preid}"`;
      } else {
        throw new Error(`Invalid Pre-Release Identifier`);
      }
    }

    // release message
    const message = await window.showInputBox({
      placeHolder: "Release Message (optional)",
    });

    if (message !== undefined && message.trim().length > 0) {
      command += ` --message="${message}"`;
    }

    const options = {
      cwd: workspace.workspaceFolders[0].uri.fsPath,
    };

    // execute command
    const response = await executeCommand(command, options);

    window.showInformationMessage(`Bumped Package Version: ${response}`);
  } catch (error) {
    window.showErrorMessage(`Unable to Bump Package Version: ${error}`);
  }
}

function executeCommand(command: string, options: Object): Promise<string> {
  return new Promise<string>(function (resolve, reject) {
    executeChildProcess(command, options, function (error, strOut) {
      if (error == null) {
        resolve(strOut);
      } else {
        reject(error.message);
      }
    });
  });
}

export function activate(context: ExtensionContext) {
  addContextSubscriptions(context);
}

export function deactivate() {}
