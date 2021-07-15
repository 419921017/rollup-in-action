/**
 *
 *
 * @param {*} entry 入口文件路径
 * @param {*} filename 文件名
 */
function rollup(entry, filename) {
  const bundle = new Bundle({ entry });
  bundle.build(filename);
}

export default rollup;
