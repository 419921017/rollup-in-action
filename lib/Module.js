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
    analyse(this.ast, this.code, this);
  }

  expendAllStatements() {
    let allStatements = [];
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
