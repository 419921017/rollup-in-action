/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-07-28 20:20:01
 * @LastEditors: power_840
 * @LastEditTime: 2021-07-28 21:30:40
 */
import MagicString from 'magic-string';
import { parse } from 'acorn';
import analyse from './analyse';

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(this.code, { sourceType: 'module', ecmaVersion: 8 });
    this.analyse();
  }
  analyse() {
    this.imports = {};
    this.exports = {};

    this.ast.body.forEach((node) => {
      // 导入类型
      if (node.type === 'ImportDeclaration') {
        let source = node.source.value;
        node.specifiers.forEach((specifier) => {
          const localName = specifier.local.name;
          const importedName = specifier.imported.name;
          this.imports[localName] = {
            source,
            importedName,
            localName,
          };
        });
        // 导出类型
      } else if (node.type === 'ExportNamedDeclaration') {
        const variableDeclaration = node.declaration;
        if (variableDeclaration.type === 'VariableDeclaration') {
          const declarations = variableDeclaration.declarations;
          declarations.forEach((variableDeclarator) => {
            const localName = variableDeclarator.id.name;
            this.exports[localName] = {
              node,
              localName,
              variableDeclarator,
            };
          });
        }
      }
    });
    analyse(this.ast, this.code, this);
    // 存放模块内所有的变量的定义语句
    this.definitions = {};
    this.ast.body.forEach((statement) => {
      // 所有顶级变量
      Object.keys(statement._defines).forEach((name) => {
        this.definitions[name] = statement;
      });
    });
  }

  expendAllStatements() {
    let allStatements = [];
    // @ts-ignore
    this.ast.body.forEach((statement) => {
      // 如果是导入声明节点, 不需要包含
      if (statement.type === 'ImportDeclaration') {
        return;
      }
      let statements = this.expendStatements(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expendStatements(statement) {
    // 标识用来避免重复导入
    statement._included = true;
    let result = [];
    // _dependsOn里存放着所有模块外定义的变量
    const dependsOns = Object.keys(statement._dependsOn);
    dependsOns.forEach((name) => {
      let definition = this.define(name);
      result.push(...definition);
    });
    result.push(statement);
    return result;
  }
  define(name) {
    if (name in this.imports) {
      const { source, importedName } = this.imports[name];
      let importModule = this.bundle.fetchModule(source, this.path);
      const exportDeclaration = importModule.exports[importedName];
      if (!exportDeclaration) {
        throw new Error(
          `Module ${importModule.path} does not export ${importedName} (imported by ${this.path})`
        );
      }
      // 返回导入的模块, 返回import模块中具体定义变量的语句
      return importModule.define(exportDeclaration.localName);
    } else {
      let statement;
      statement = this.definitions[name];
      if (statement && !statement._included) {
        return this.expendStatements(statement);
      } else {
        return [];
      }
    }
  }
}

export default Module;
