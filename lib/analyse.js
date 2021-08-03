import Scope from './scope';
import walk from './walk';

/**
 * 分析语法树
 *
 * @param {*} ast
 * @param {*} code
 * @param {*} module
 */
function analyse(ast, code, module) {
  let currentScope = (globalScope = new Scope());

  ast.body.forEach((statement) => {
    function addToScope(declarator) {
      // 函数名
      let name = declarator.id.name;
      currentScope.add(name);
      // 如果当前作用域是顶级作用域
      if (!currentScope.parent) {
        statement._defines[name] = true; // 设置顶级变量
      }
    }
    Object.defineProperties(statement, {
      // 给每个statement(语句节点)添加一个_source属性, 对应的源代码
      _source: { value: code.snip(statement.start, statement.end) },
      _defines: { value: {} }, // 当前节点定义了哪些变量
      _includes: { value: false, writable: true }, // 当前节点是否已经被包含到输出结果里了
      _dependsOn: { value: {} }, // 当前节点引用哪些外部依赖变量(可能是在模块内定义的, 也有可能是模块外定义的)
      _scope: globalScope,
    });
    walk(statement, {
      enter(node) {
        let newScope;
        switch (node.type) {
          case 'FunctionDeclaration':
            const paramNames = node.params.map(getName);
            addToScope(node);
            newScope = new Scope({
              parent: currentScope,
              params: paramNames,
            });
            break;
          case 'VariableDeclaration':
            node.declarations.forEach(addToScope);
            break;
        }
        // 如果有新作用域产生的话, 将当前作用域切换成新作用域
        if (newScope) {
          Object.defineProperty(node, '_scope', { value: newScope });
          currentScope = newScope;
        }
      },
      leave(node) {
        if (node._scope) {
          currentScope = scope.parent;
        }
      },
    });
  });
  ast.body.forEach((statement) => {
    walk(statement, {
      enter(node, parent) {
        if (node.type === 'Identifier') {
          // 子节点没有就往父节点
          // let scope = node._scope || parent._scope || currentScope;
          let scope = findScope(node);
          // 一层一层向上找
          const definingScope = scope.findDefiningScope(node.name);
          if (!definingScope) {
            // 如果本作用域都找不到, 说明是外部导入的变量
            statement._dependsOn[node.name] = true;
          }
        }
      },
    });
  });
}

function getName(param) {
  return param.name;
}

function findScope(node) {
  let scope = node._scope;
  while (!scope) {
    node = node.parent;
    scope = node._scope;
  }
  return scope;
}
export default analyse;
