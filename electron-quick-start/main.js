const {app, BrowserWindow, Menu, Notification,dialog} = require('electron')

let mainWindow;
// 主窗体配置
function mainWindowFun() {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载应用的 index.html
  mainWindow.loadFile('index.html')

  // 打开开发工具
  mainWindow.openDevTools();

  // 当 window 被关闭，这个事件会被发出
  mainWindow.on('closed', function () {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    mainWindow = null
  })
}

// let tc;
// 弹窗配置
// function tcFun() {
//   tc = new Notification({
//     title:'标题',
//     body:'吃我一个内容'
//   })
//
//   tc.on('show',function () {
//       document.write("show")
//   })
//
//   tc.on('click',function () {
//     document.write("click")
//   })
//
// }

// 选择文件配置
function selectFile() {
  dialog.showOpenDialog(mainWindow,
    {
      title:'选择文件',
      defaultPath:"url",
      filters: [
        // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
        // { name: 'Custom File Type', extensions: ['as'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      // properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
    },function(response){
      console.log(response)
    }
  )
}

// 菜单配置
function setMenu() {

  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        },
        {
          label:'测试',
          click () { selectFile() }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// ready
function createWindow () {
  // 窗体
  mainWindowFun()
  // 弹窗
  // tcFun()
  //菜单
  setMenu()

dialog.showMessageBox(mainWindow,
  {
    title:'消息框',
    message:'message',
    info:'question', //error question warning
    detail:'detail'
  },
  function (response) {
    console.log(response)
  }
);


//   dialog.showMessageBox(
//     {title:'title',message:'message',detail:'detail'},
//     function (title) {
//       console.log(title)
//     }
//   );

}

//此方法将在电子完成时调用
//初始化并准备创建浏览器窗口。
//某些API只能在此事件发生后使用。
app.on('ready', createWindow)

//关闭所有窗口后退出。
app.on('window-all-closed', function () {
  //在MacOS上，应用程序及其菜单栏很常见
  //在用户使用cmd+q显式退出之前保持活动状态
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

//在此文件中，您可以包含应用程序的其他特定主进程
//代码。您也可以将它们放在单独的文件中，并在此处要求它们。
app.setName('设置应用名字')






