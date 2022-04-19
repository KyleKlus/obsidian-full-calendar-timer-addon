import {
    App,
    PluginSettingTab,
    Setting
} from 'obsidian';
import TimerAddon from './main';



export class SettingsTab extends PluginSettingTab {
	plugin: TimerAddon;

	constructor(app: App, plugin: TimerAddon) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'General Settings'});

		new Setting(containerEl)
			.setName('Toggle Format')
			.setDesc('This toggles between 24h / 12h clock format.')
			.addToggle(boolean => boolean
				.setValue(true)
				.onChange(async (value) => {
					if(value){
						this.plugin.settings.clockFormat = 'HH:mm';
					}else{
						this.plugin.settings.clockFormat = 'hh:mm a';
					}
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable Timer')
			.setDesc('This enables the timer function.')
			.addToggle(boolean => boolean
				.setValue(true)
				.onChange(async (value) => {
					this.plugin.settings.enableTimerMode = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Calendar Path')
			.setDesc('This is the path of the calendar directory.')
			.addText(text => text
				.setValue(this.plugin.settings.calendarPath)
				.onChange(async (value) => {
					this.plugin.settings.calendarPath = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Time Until Timer')
			.setDesc('This is the time (in min.) until the timer shows an upcoming event in the statusbar.')
			.addText(text => text
				.setValue(this.plugin.settings.minUntilTimerMode)
				.onChange(async (value) => {
					this.plugin.settings.minUntilTimerMode = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Date format')
			.setDesc('This the format of your dates.')
			.addText(text => text
				.setValue(this.plugin.settings.dateFormat)
				.onChange(async (value) => {
					this.plugin.settings.dateFormat = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h2', {text: 'Tags Settings'});
		
		new Setting(containerEl)
			.setName('Break Tag')
			.setDesc('This sets the tag for a break timer.')
			.addText(text => text
				.setValue(this.plugin.settings.breakTag)
				.onChange(async (value) => {
					this.plugin.settings.breakTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Unused Tag')
			.setDesc('This sets the tag for a usable space in your Day Planner.')
			.addText(text => text
				.setValue(this.plugin.settings.unusedTag)
				.onChange(async (value) => {
					this.plugin.settings.unusedTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Start Tag')
			.setDesc('This sets the tag for a paused timer.')
			.addText(text => text
				.setValue(this.plugin.settings.startTag)
				.onChange(async (value) => {
					this.plugin.settings.startTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Stop Tag')
			.setDesc('This sets the tag for a stopped timer.')
			.addText(text => text
				.setValue(this.plugin.settings.stopTag)
				.onChange(async (value) => {
					this.plugin.settings.stopTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Canceled Tag')
			.setDesc('This sets the tag for a canceled timer.')
			.addText(text => text
				.setValue(this.plugin.settings.cancelTag)
				.onChange(async (value) => {
					this.plugin.settings.cancelTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Task Tag')
			.setDesc('This sets the tag for a task.')
			.addText(text => text
				.setValue(this.plugin.settings.taskTag)
				.onChange(async (value) => {
					this.plugin.settings.taskTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Timer Tag')
			.setDesc('This sets the tag for a regular timer.')
			.addText(text => text
				.setValue(this.plugin.settings.timerTag)
				.onChange(async (value) => {
					this.plugin.settings.timerTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Stop Watch Tag')
			.setDesc('This sets the tag for a stop watch.')
			.addText(text => text
				.setValue(this.plugin.settings.stopWatchTag)
				.onChange(async (value) => {
					this.plugin.settings.stopWatchTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Clock Tag')
			.setDesc('This sets the tag for the clock.')
			.addText(text => text
				.setValue(this.plugin.settings.clockTag)
				.onChange(async (value) => {
					this.plugin.settings.clockTag = value;
					await this.plugin.saveSettings();
				}));
	}
}