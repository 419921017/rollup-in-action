!(function () {
  'use strict';
  !(function (e, t) {
    void 0 === t && (t = {});
    var n = t.insertAt;
    if (e && 'undefined' != typeof document) {
      var o = document.head || document.getElementsByTagName('head')[0],
        d = document.createElement('style');
      (d.type = 'text/css'),
        'top' === n && o.firstChild
          ? o.insertBefore(d, o.firstChild)
          : o.appendChild(d),
        d.styleSheet
          ? (d.styleSheet.cssText = e)
          : d.appendChild(document.createTextNode(e));
    }
  })(
    'body {\n  background-color: aquamarine;\n  color: red;\n  font-size: 16px;\n}'
  );
  console.log('aaa12');
})();
