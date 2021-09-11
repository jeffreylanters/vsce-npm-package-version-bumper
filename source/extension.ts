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

export function activate(context: ExtensionContext) {
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

    // execution options
    const options = {
      cwd: workspace.workspaceFolders[0].uri.fsPath,
    };

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

    // get the version name and replace it to match the command arg
    picked = picked.toLowerCase().replace("-", "");

    let command = `npm version ${picked}`;

    // pre-id
    if (picked.includes("pre")) {
      const preid = await window.showInputBox({
        placeHolder: "Pre-Release Identifier",
      });

      if (preid !== undefined && /^[a-zA-Z]+$/.test(preid)) {
        command += ` --preid="${preid}"`;
      } else {
        throw new Error(`Invalid Pre-Release Identifier`);
      }
    }

    // git version tags
    const createGitVersionTag = workspaceConfiguration.get<boolean>(
      "npmPackageVersionBumper.createGitVersionTag"
    );

    if (createGitVersionTag === false) {
      command += " --no-git-tag-version";
    }

    // release message
    const askForMessage = workspaceConfiguration.get<boolean>(
      "npmPackageVersionBumper.askForMessage"
    );

    if (askForMessage === true) {
      const message = await window.showInputBox({
        placeHolder: "Release Message (optional)",
      });

      if (message !== undefined && message.trim().length > 0) {
        command += ` --message="${message}"`;
      }
    }

    // execute command
    const result = await executeCommand(command, options);

    const gitPushButtonLabel = "Git Push with Tags";

    // show result and ask to push to origin
    const selection = await window.showInformationMessage(
      `Bumped Package Version: ${result}`,
      gitPushButtonLabel
    );

    try {
      // if a selection is made push to origin with tags
      if (selection !== undefined && selection === gitPushButtonLabel) {
        const command = `git push --follow-tags`;

        // execute command
        await executeCommand(command, options);

        // show result
        window.showInformationMessage(`Pushed Tag to origin`);
      }
    } catch (error) {
      // if an error occurs during pushing to git show error
      window.showErrorMessage(`Unable to Push Tags to Origin: ${error}`);
    }
  } catch (error) {
    // if an error occurs during the version bump show error
    window.showErrorMessage(`Unable to Bump Package Version: ${error}`);
  }
}

// helper method to execute a command async
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
