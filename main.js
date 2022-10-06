const { app, dialog, Tray, BrowserWindow } = require('electron');
const path = require('path');
// auto update
// note:
// code must be signed
require('update-electron-app')();

// create window
function createWindow () {
  const win = new BrowserWindow({
    icon: path.join(__dirname, 'build/icons/icon.icns'),
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.loadFile('index.html');
}

// register url
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('my-electron-app', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('my-electron-app');
}

// ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// on window all closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// on open url
app.on('open-url', (event, url) => {
   dialog.showErrorBox('Welcome to back', `from ${url}`);
})

// 使用 electron-builder 打包
// 1.安装 electron-builder 执行命令：npm install electron-builder
// 2.配置 build 参数
// "build":{
//     "appId":"com.test.app",
//     "productName":"testApp",    //项目名
//     "directories":{
//         "buildResources":"build",    //默认资源文件夹，打包时该文件不会被打包
//         "output":"build"    //打包输出文件夹
//     },
//     "win":{
//         "target":[{
//             "target":"nsis",
//             "arch":["ia32","x64"]    //打出32bit+64bit的包(包体积较大，不建议，一般只选择一个)
//         }],
//         "icon":"build/logo/icon.ico",
//         "asarUnpack":["build/**","README.md"]    //不会被压缩进app.asar的资源
//     },
//     "mac":{
//         "icon":"build/logo/icon.icns"
//     },
//     "nsis":{
//         "oneClick":false,    //是否一键安装
//         "allowElevation":true,    //是否允许请求提升
//         "allowToChangeInstallationDirectory":true,    //允许修改目录
//         "installerIcon":"build/logo/icon.ico",    //安装图标
//         "uninstallerIcon":"build/logo/icon.ico",    //卸载图标
//         "installerHeaderIcon":"build/logo/icon.ico",    //安装时头部图标
//         "createDesktopShortcut":true,    //是否创建桌面图标
//         "createStartMenuShortcut":true,    //是否创建开始菜单图标
//         "shortcutName":"testApp",    //开始菜单名称
//         "include":"build/script/installer.nsh"    //自定义nsis脚本
//     }
// }
// 3.在 package.json 文件中配置打包
// "scripts": {
//     "start": "electron .",
//     "build": "electron-builder",
//     "build:dir": "electron-builder --dir",    //不会生成安装程序，一般用于测试打包
//     "build:win64": "electron-builder --win --x64",
//     "build:mac": "electron-builder --mac"
// }
// 4.执行打包命令
// 与 electron-packager 一样，在windows系统下只能打 windows 包，不能打 macOS 包。 打包命令：npm run build 或 npm run build:mac

// 执行完命令后，在项目根目录 build 文件夹下会生成一个应用程序文件夹及安装程序，如果使用 npm run build:dir 命令打包，则不会生成安装程序，这样打包速度快，一般用于测试，只会生成应用程序文件夹，打开文件夹里面包含 .exe 文件，点击运行 exe 文件，没有报错则说明打包成功。
