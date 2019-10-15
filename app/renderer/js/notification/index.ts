'use strict';

import { remote } from 'electron';
import * as params from '../utils/params-util';
import { appId, loadBots } from './helpers';

import WinRTNotifier = require('electron-windows-notifications');
import DefaultNotification = require('./default-notification');
import shortcut = require('node-win-shortcut');
// const {registerAppForNotificationSupport} = require('electron-windows-interactive-notifications');
const { app } = remote;

// From https://github.com/felixrieseberg/electron-windows-notifications#appusermodelid
// On windows 8 we have to explicitly set the appUserModelId otherwise notification won't work.
app.setAppUserModelId(appId);

window.Notification = DefaultNotification;

if (process.platform === 'darwin') {
	window.Notification = require('./darwin-notifications');
}

if (process.platform === 'win32') {
	const version = require('os').release().split('.');
	// Windows 8 and above only.
	if (version[0] >= 8) {
		// const WinRTNotification = require('./winrt-notifications');
		// window.Notification = WinRTNotification;
		shortcut.createShortcut(process.execPath, 'Zulip Electron', appId);
		// const shortcutPath = 'Microsoft\\Windows\\Start Menu\\Programs\\ZulipElectron.lnk'
		// registerAppForNotificationSupport(shortcutPath, appId);
		const path = "F:\\GitHub\\zulip-desktop\\app\\renderer\\img\\icon.png";
		const notification = new WinRTNotifier.ToastNotification({
			appId,
			// template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
			// <!-- <image placement="appLogoOverride" hint-crop="circle" src="../img/icon.png"/> -->
			template: `<toast launch="zulip">
					<visual>
					<binding template="ToastGeneric">
						   <text hint-maxLines="1">%s</text>
						   <image placement="appLogoOverride" hint-crop="circle" src="%s"/>
					<text>%s</text>
				</binding>
				</visual>
				<actions>
					<input id="textBox" type="text" placeHolderContent="Type a reply"/>	
					<action hint-inputId="message" activationType="background" content="Reply" arguments="send" />
				</actions>			
				</toast>`,
			strings: ['Sender', path, 'Message']
		});
		notification.show();
	}
}

window.addEventListener('load', () => {
	// eslint-disable-next-line no-undef, @typescript-eslint/camelcase
	if (params.isPageParams() && page_params.realm_uri) {
		loadBots();
	}
});
