import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs-extra');

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "darcyvscode" is now active!');
  const templatesPath = context.asAbsolutePath('src/templates');
  context.asAbsolutePath;
  context.subscriptions.push(
    vscode.commands.registerCommand('darcy.createPage', async uri => {
      const name = await vscode.window.showInputBox({
        prompt: `请输入页面名称`,
        value: '新页面',
        valueSelection: [0, '新页面'.length],
      });
      if (name) {
        const targetFloderPath = path.join(uri.fsPath, name + '/' + name);
        const pageFolderPath = path.join(templatesPath, 'page');

        await fs.copy(`${pageFolderPath}/index.axml`, `${targetFloderPath}.axml`);
        await fs.copy(`${pageFolderPath}/index.js`, `${targetFloderPath}.ts`);
        await fs.copy(`${pageFolderPath}/index.json`, `${targetFloderPath}.json`);
        await fs.copy(`${pageFolderPath}/index.less`, `${targetFloderPath}.less`);
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('darcy.createComponent', async uri => {
      const name = await vscode.window.showInputBox({
        prompt: `请输入组件名称`,
        value: '新组件',
        valueSelection: [0, '新组件'.length],
      });
      if (name) {
        const targetFloderPath = path.join(uri.fsPath, name + '/' + name);
        const pageFolderPath = path.join(templatesPath, 'component');

        await fs.copy(`${pageFolderPath}/index.axml`, `${targetFloderPath}.axml`);
        await fs.copy(`${pageFolderPath}/index.js`, `${targetFloderPath}.ts`);
        await fs.copy(`${pageFolderPath}/index.json`, `${targetFloderPath}.json`);
        await fs.copy(`${pageFolderPath}/index.less`, `${targetFloderPath}.less`);
      }
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
