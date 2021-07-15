import fs from 'fs';
import MagicString from 'magic-string';

class Bundle {
  /**
   * Creates an instance of Bundle.
   * @param {*} { entry }
   * @memberof Bundle
   * @public modules 存放着所有模块
   */
  constructor({ entry }) {
    this.entry = entry;

    this.modules = {};
  }
  build(filename) {
    let entryModule = this.fetchModule(this.entry);
    this.statements = entryModule.expendAllStatements();
    const { code } = this.generate();
    fs.writeFileSync(filename, code, 'utf-8');
  }
  fetchModule(modulePath) {
    if (modulePath) {
      let sourceCode = fs.readFileSync(modulePath, 'utf-8');
      const module = new Module({
        code: sourceCode,
        path: modulePath,
        bundle: this,
      });
      return module;
    }
  }
  generate() {
    let magicStringBundle = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      let source = statement._source.toString();
      magicStringBundle.addSource({ content: source, separator: '\n' });
    });
    return { code: magicStringBundle.toString() };
  }
}

export default Bundle;
