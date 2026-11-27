import { app, Menu, shell } from 'electron'

const isMac = process.platform === 'darwin'

// Standard application menu. Edit the templates to add your own items.
export const createMenu = () => {
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn more',
          click: () => shell.openExternal('https://aamshaegar.github.io/NextronJS-app-router/'),
        },
        { label: `Version ${app.getVersion()}`, enabled: false },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
