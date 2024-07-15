import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import dotenv from 'dotenv';

dotenv.config();

let mainWindow: BrowserWindow | null = null;
let preferencesWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? {} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createPreferencesWindow(): void {
  if (preferencesWindow) {
    preferencesWindow.focus();
    return;
  }

  preferencesWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    parent: mainWindow!,
    modal: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  preferencesWindow.on('ready-to-show', () => {
    preferencesWindow!.show();
  });

  preferencesWindow.on('closed', () => {
    preferencesWindow = null;
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    preferencesWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/preferences`);
  } else {
    preferencesWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'preferences' });
  }
}

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Preferences',
          click: () => createPreferencesWindow()
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
    // Add other menu items as needed
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();
  createMenu();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
import { ChatOpenAI } from '@langchain/openai';
import { Conversation, MessageType } from '../model/Conversation';

let model: ChatOpenAI;

ipcMain.on(
  'conversation',
  async (event, conversation: Conversation, provider: string, modelName: string) => {
    // Update the model based on the selected provider and model
    switch (provider) {
      case 'OpenAI':
        model = new ChatOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          modelName: modelName
        });
        break;
      // Add cases for other providers here
      default:
        console.error('Unsupported provider:', provider);
        return;
    }

    const tokens = [] as string[];
    const text = conversation.messages.map((m) => m.text);
    const message = {
      text: '',
      messageType: MessageType.Reply,
      provider: provider,
      modelName: modelName
    };
    try {
      for await (const chunk of await model.stream(text)) {
        tokens.push(chunk.content.toString());
        event.sender.send('reply-stream', {
          ...conversation,
          messages: [
            ...conversation.messages,
            {
              ...message,
              text: tokens.join('')
            }
          ]
        });
      }
      event.sender.send('reply-stream-end');
    } catch (error) {
      console.error('Error in conversation:', error);
      //event.sender.send('reply-stream-error', error.message);
    }
  }
);
