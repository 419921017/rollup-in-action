/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-07-28 20:20:01
 * @LastEditors: power_840
 * @LastEditTime: 2021-07-28 20:43:43
 */
import fs from "fs";
import path from "path";
import MagicString from "magic-string";

import Module from "./Module";

class Bundle {
  /**
   * Creates an instance of Bundle.
   * @param {*} { entry }
   * @memberof Bundle
   * @public modules 存放着所有模块
   */
  constructor({ entry }) {
    // 1. 自动添加后缀.js
    // 2. 兼容相对路径
    this.entry = path.resolve(entry.replace(/\.js$/, "") + ".js");
    this.entry = entry;

    this.modules = {};
  }
  build(filename) {
    // 获取模块实例
    let entryModule = this.fetchModule(this.entry);
    this.statements = entryModule.expendAllStatements();
    const { code } = this.generate();
    fs.writeFileSync(filename, code, "utf-8");
  }

  /**
   *
   *
   * @param {*} importee 被引用的模块
   * @param {*} importer 引用的模块
   * @return {*}
   * @memberof Bundle
   */
  fetchModule(importee, importer) {
    let route;
    if (!importer) {
      route = importee;
    } else {
      // 判断是否是绝对路径
      if (path.isAbsolute(importee)) {
        route = importee;
      } else if (importee[0] == ".") {
        // 将相对路径转换成绝对路径
        route = path.resolve(path.dirname(importer), importee);
      }
    }
    if (route) {
      let sourceCode = fs.readFileSync(route, "utf-8");
      const module = new Module({
        code: sourceCode,
        path: route,
        bundle: this,
      });
      return module;
    }
  }
  generate() {
    let magicStringBundle = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      let source = statement._source.toString();
      magicStringBundle.addSource({ content: source, separator: "\n" });
    });
    return { code: magicStringBundle.toString() };
  }
}

export default Bundle;
