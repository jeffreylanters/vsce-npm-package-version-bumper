import { window, commands, workspace } from "vscode";
import { ExtensionContext } from "vscode";
import * as ChildProcess from "child_process";

class Extension {
  public activate(context: ExtensionContext): void {
    const _item = window.createStatusBarItem();
    _item.text = "$(versions) Bump";
    _item.tooltip = "Bump Npm Package Version";
    _item.command = "bump-npm-package-version";
    _item.show();
    const _command = commands.registerCommand(
      "bump-npm-package-version",
      this.onBumpVersion.bind(this)
    );
    context.subscriptions.push(_item, _command);
  }

  public deactivate(): void {}

  private async onBumpVersion() {
    const _pick = await window.showQuickPick(["Major", "Minor", "Patch"]);
    if (
      typeof _pick !== "undefined" &&
      typeof workspace.workspaceFolders !== "undefined" &&
      workspace.workspaceFolders.length > 0
    ) {
      window.showInformationMessage(`Bumped ${_pick} NPM Package Version`);
      ChildProcess.exec(`npm version ${_pick!.toLowerCase()}`, {
        cwd: workspace.workspaceFolders[0].uri.fsPath
      });
    }
  }
}

const extension = new Extension();
export function activate(context: ExtensionContext): void {
  extension.activate(context);
}
export function deactivate(): void {
  extension.deactivate();
}
