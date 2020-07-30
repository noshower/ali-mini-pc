import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';

function findAppRootPath(filePath: string): string | null {
  let dir = path.dirname(filePath);
  while (dir && dir.length > 0) {
    if (fs.pathExistsSync(path.join(dir, 'app.json'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}

function findCompoentName(filePath: string, existComponentNames: Set<string>) {
  const stat = fs.statSync(filePath);
  if (stat.isFile() && path.extname(filePath) === '.json') {
    let jsonObject: any = {};
    try {
      jsonObject = fs.readJSONSync(filePath);
    } catch {}
    const fileName = path.basename(filePath, '.json');
    if (jsonObject.component) {
      if (existComponentNames.has(fileName)) {
        vscode.window.showErrorMessage(`组件${fileName}已存在，请换一个名字`);
        throw new Error('组件名重复');
      } else {
        existComponentNames.add(fileName);
      }
    }
  } else if (stat.isDirectory()) {
    fs.readdirSync(filePath).forEach((name: string) => {
      if (name !== 'node_modules') {
        findCompoentName(path.join(filePath, name), existComponentNames);
      }
    });
  }
}

function findSameComponentName(filePath: string, existComponentNames: Set<string>) {
  const appRootPath = findAppRootPath(filePath);
  if (!appRootPath) {
    return;
  }
  return findCompoentName(appRootPath, existComponentNames);
}

export function activate(context: vscode.ExtensionContext) {
  const templatesPath = context.asAbsolutePath('templates');

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
        try {
          findSameComponentName(uri.fsPath, new Set([name]));
          await fs.copy(`${pageFolderPath}/index.axml`, `${targetFloderPath}.axml`);
          await fs.copy(`${pageFolderPath}/index.js`, `${targetFloderPath}.ts`);
          await fs.copy(`${pageFolderPath}/index.json`, `${targetFloderPath}.json`);
          await fs.copy(`${pageFolderPath}/index.less`, `${targetFloderPath}.less`);
        } catch (e) {
          console.log(e);
        }
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('darcy.checkComponentName', async uri => {
      try {
        findSameComponentName(uri.fsPath, new Set());
      } catch (e) {}
    }),
  );
}

export function deactivate() {}
