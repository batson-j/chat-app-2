/* eslint-disable @typescript-eslint/no-explicit-any */
interface IpcRendererAPI {
  on: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => void;
  off: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => void;
  send: (channel: string, ...args: any[]) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  removeListener: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => void;
  once: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => void;
  removeAllListeners: (channel: string) => void;
}

interface Window {
  ipcRenderer: IpcRendererAPI;
}
