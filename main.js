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