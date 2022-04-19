import { Plugin} from 'obsidian';
import { Settings, DEFAULT_SETTINGS } from 'src/settings';
import { SettingsTab } from 'src/settings-tab';
import { EventKeeper } from './event-keeper';

export default class TimerAddon extends Plugin {
	settings: Settings;
	eventKeeper: EventKeeper;
	statusClock: HTMLElement;

	async onload() {
		console.log("Loading timer addon for full calendar");
		await this.loadSettings();

		this.initClock();

		this.addSettingTab(new SettingsTab(this.app, this));		
	}

	onunload() {
		this.eventKeeper = null;
		this.statusClock.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async updateStatusClock() {
		this.statusClock.setText(await this.eventKeeper.update());
	}

	private async initClock(){
		this.statusClock = this.addStatusBarItem();
		this.eventKeeper = new EventKeeper(this);
		this.statusClock.setText(await this.eventKeeper.update());
		
		this.registerInterval(window.setInterval(async () => await this.updateStatusClock(), 1000));
	}
}


