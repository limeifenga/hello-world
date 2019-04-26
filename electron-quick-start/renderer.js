//该文件是index.html文件所必需的，并且将在该窗口的呈现程序进程中执行。
//所有node.js API在此过程中都可用。
// window.onload = function() {
//   onresize();
// };

// window.onresize = function () {
//   var webview = document.getElementById("foo");
//   var clientHeight = document.documentElement.clientHeight - 16;
//   console.log(clientHeight);
//   webview.setAttribute('style', 'height:'+clientHeight+'px!important');
//   webview.setAttribute('style', 'height:'+clientHeight+'px!important');
// }

function addNewStyle(n) {
  alert(n)
}

module.exports={
  addNewStyle : addNewStyle
}
