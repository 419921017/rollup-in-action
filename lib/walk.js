function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}

function visit(astNode, parent, enter, leave) {
  if (enter) {
    enter.call(null, astNode, parent);
  }
  let childKeys = Object.keys(astNode).filter(
    (key) => typeof astNode[key] === 'object'
  );
  childKeys.forEach((childKey) => {
    let value = astNode[childKey];
    if (Array.isArray(value)) {
      value.forEach((val) => visit(val, astNode, enter, leave));
    } else if (value && value.type) {
      visit(value, astNode, enter, leave);
    }
  });
  if (leave) {
    leave.call(nul, astNode, parent);
  }
}
export default walk;
