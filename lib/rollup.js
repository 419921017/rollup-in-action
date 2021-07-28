/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-07-28 20:20:01
 * @LastEditors: power_840
 * @LastEditTime: 2021-07-28 20:25:33
 */
import Bundle from "./Bundle";

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
