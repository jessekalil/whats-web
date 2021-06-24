import { app, BrowserWindow, globalShortcut, nativeImage, Session } from "electron"
import * as path from "path"

import { USER_AGENT } from "./constants"

if (require("electron-squirrel-startup")) {
	app.quit()
}

const createShortcuts = (window: BrowserWindow): void => {
	globalShortcut.register("CmdOrCtrl+J", () => {
		window.webContents.toggleDevTools()
	})
}

const createWindow = async (): Promise<void> => {
	const icon = nativeImage.createFromPath(path.resolve(__dirname, "./icon.png"))

	const mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		icon,
		webPreferences: {
			preload: path.resolve(__dirname, "preload.js"),
		},
	})

	await setSession(mainWindow.webContents.session)
	createShortcuts(mainWindow)

	mainWindow.removeMenu()
	mainWindow.loadURL("https://web.whatsapp.com", { userAgent: USER_AGENT })
}

const setSession = async (session: Session) => {
	// localStorage.clear()
	// localStorage.setItem("WABrowserId", session.WABrowserId)
	// localStorage.setItem("WASecretBundle", session.WASecretBundle)
	// localStorage.setItem("WAToken1", session.WAToken1)
	// localStorage.setItem("WAToken2", session.WAToken2)
}

app.on("ready", async () => {
	createWindow()
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
