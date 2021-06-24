import { window, commands, workspace } from "vscode";
import { ExtensionContext } from "vscode";
import { exec as executeChildProcess } from "child_process";

const versionNames: Array<string> = ["Major", "Minor", "Patch"];
const preVersionNames: Array<string> = [
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
    const workspaceConfiguration = workspace.getConfiguration();

    // show version name picker
    const includePreVersion = workspaceConfiguration.get(
      "npmPackageVersionBumper.includePreVersions"
    );

    let picked = await window.showQuickPick(
      includePreVersion === true
        ? [...versionNames, ...preVersionNames]
        : versionNames
    );

    if (picked === undefined) {
      return;
    }

    picked = picked.toLowerCase().replace("-", "");

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
    const askForReleaseMessage = workspaceConfiguration.get<boolean>(
      "npmPackageVersionBumper.askForReleaseMessage"
    );

    if (askForReleaseMessage === true) {
      const message = await window.showInputBox({
        placeHolder: "Release Message (optional)",
      });

      if (message !== undefined && message.trim().length > 0) {
        command += ` --message="${message}"`;
      }
    }

    // execute command
    const options = {
      cwd: workspace.workspaceFolders[0].uri.fsPath,
    };

    const result = await executeCommand(command, options);

    window.showInformationMessage(`Bumped Package Version: ${result}`);
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
