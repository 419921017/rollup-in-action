/**
 * 分析语法树
 *
 * @param {*} ast
 * @param {*} code
 * @param {*} module
 */
function analyse(ast, code, module) {
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      // 给每个statement(语句节点)添加一个_source属性, 对应的源代码
      _source: { value: code.snip(statement.start, statement.end) },
    });
  });
}

export default analyse;
