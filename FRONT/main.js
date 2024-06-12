const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
let mainWindow;
let backendFlaskApp;

const frontendReactApp = express();
frontendReactApp.use(express.static(path.join(__dirname, "build")));
frontendReactApp.listen(3000, () => {});

const createWindow = () => {
  const setupFlask = () => {
    const scriptPath = path.join(__dirname, "../BACK/BACK.py");
    backendFlaskApp = spawn("python", [scriptPath]);
    backendFlaskApp.on("error", (err) => {
      console.error("Failed to start Flask process:", err);
    });
    backendFlaskApp.stdout.on("data", (data) => {
      console.log(`Flask: ${data.toString()}`);
    });
    backendFlaskApp.stderr.on("data", (data) => {
      console.error(`Flask Error: ${data.toString()}`);
    });
  };
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  setTimeout(() => {
    const startUrl = "http://localhost:3000";
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();
  }, 5000);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
    backendFlaskApp.kill();
  });
  setupFlask();
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
