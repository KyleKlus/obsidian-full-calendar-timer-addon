import {
    App,
    PluginSettingTab,
    Setting
} from 'obsidian';
import CustomTimerPlugin from './main';



export class TimerSettingsTab extends PluginSettingTab {
	plugin: CustomTimerPlugin;

	constructor(app: App, plugin: CustomTimerPlugin) {
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
			.setName('Enable Statusbar Clock')
			.setDesc('This enables the clock in the statusbar.')
			.addToggle(boolean => boolean
				.setValue(this.plugin.settings.enableClock)
				.onChange(async (value) => {
					this.plugin.settings.enableClock = value;
					await this.plugin.saveSettings();
					if(this.plugin.settings.enableClock){
						this.plugin.showEl(this.plugin.statusClock);
						this.plugin.updateStatusClock();
					}else{
						this.plugin.hideEl(this.plugin.statusClock);
					}
				}));

		new Setting(containerEl)
			.setName('Enable Logging')
			.setDesc('This enables the ability to log to a specific file.')
			.addToggle(boolean => boolean
				.setValue(this.plugin.settings.enableLog)
				.onChange(async (value) => {
					this.plugin.settings.enableLog = value;
				}));

		new Setting(containerEl)
			.setName('Log to daily note')
			.setDesc('This enables the ability to log to the daily note (is overridden by "Enable Logging").')
			.addToggle(boolean => boolean
				.setValue(this.plugin.settings.logToDailyNote)
				.onChange(async (value) => {
					this.plugin.settings.logToDailyNote = value;
				}));

		new Setting(containerEl)
			.setName('Log File')
			.setDesc('This the file to which the timer will be logged.')
			.addText(text => text
				.setValue(this.plugin.settings.logFileName)
				.onChange(async (value) => {
					this.plugin.settings.logFileName = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Daily note format')
			.setDesc('This the format of your daily notes.')
			.addText(text => text
				.setValue(this.plugin.settings.dailyNoteFormat)
				.onChange(async (value) => {
					this.plugin.settings.dailyNoteFormat = value;
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