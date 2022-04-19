import { Plugin} from 'obsidian';
import { Settings, DEFAULT_SETTINGS } from 'src/settings';
import { SettingsTab } from 'src/settings-tab';
import { EventKeeper } from './event-keeper';

export default class TimerAddon extends Plugin {
	settings: Settings;
	timeKeeper: EventKeeper;
	statusClock: HTMLElement;

	async onload() {
		console.log("Loading timer addon for full calendar");
		await this.loadSettings();

		this.initClock();

		this.addSettingTab(new SettingsTab(this.app, this));		
	}

	onunload() {
		this.timeKeeper = null;
		this.statusClock.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async updateStatusClock() {
		this.statusClock.setText(await this.timeKeeper.update());
	}

	hideEl(el: HTMLElement){
		if(el){
			el.style.display = 'none';
		}
	}

	showEl(el: HTMLElement){
		if(el){
			el.style.display = 'block';
		}
	}

	private async initClock(){
		this.statusClock = this.addStatusBarItem();
		this.timeKeeper = new EventKeeper(this);
		this.statusClock.setText(await this.timeKeeper.update());
		
		this.registerInterval(window.setInterval(async () => await this.updateStatusClock(), 1000));
	}
}


