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
  }

  expendAllStatements() {
    let allStatements = [];
    // @ts-ignore
    this.ast.body.forEach((statement) => {
      let statements = this.expendStatements(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expendStatements(statement) {
    // 标识用来避免重复导入
    statement._included = true;
    let result = [];
    result.push(statement);
    return result;
  }
}

export default Module;
