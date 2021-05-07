import { window, commands, workspace } from "vscode";
import { ExtensionContext } from "vscode";
import { exec as ChildProcessExec, ExecException } from "child_process";

class Extension {
  private readonly versionBumpTypes: string[] = [
    "Major",
    "Minor",
    "Patch",
    "Pre-Major",
    "Pre-Minor",
    "Pre-Patch",
    "Pre-Release",
  ];

  public activate(context: ExtensionContext): void {
    const statusBarItem = window.createStatusBarItem();
    statusBarItem.text = "$(versions) Bump";
    statusBarItem.tooltip = "Bump Npm Package Version";
    statusBarItem.command = "bump-npm-package-version";
    statusBarItem.show();
    const command = commands.registerCommand(
      "bump-npm-package-version",
      this.handleOnCommandBumpNpmPackageVersion.bind(this)
    );
    context.subscriptions.push(statusBarItem, command);
  }

  private async handleOnCommandBumpNpmPackageVersion() {
    const picked = await window.showQuickPick(this.versionBumpTypes);
    if (
      typeof picked !== "undefined" &&
      typeof workspace.workspaceFolders !== "undefined" &&
      workspace.workspaceFolders.length > 0
    )
      ChildProcessExec(
        `npm version ${picked.toLowerCase().replace("-", "")}`,
        { cwd: workspace.workspaceFolders[0].uri.fsPath },
        this.handleOnChildProcessExecCompleted.bind(this)
      );
  }

  private handleOnChildProcessExecCompleted(
    error: ExecException | null,
    stdOut?: string,
    strError?: string
  ): void {
    if (typeof error !== "undefined")
      window.showErrorMessage(
        `Something went wrong while bumping: ${error!.message}`
      );
    else
      window.showInformationMessage(
        "Successfully bumped the NPM Package Version"
      );
  }

  public deactivate(): void {}
}

const extension = new Extension();

export function activate(context: ExtensionContext): void {
  extension.activate(context);
}
export function deactivate(): void {
  extension.deactivate();
}
