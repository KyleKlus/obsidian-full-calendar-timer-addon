import { Plugin} from 'obsidian';
import { TimerSettings, DEFAULT_SETTINGS } from 'src/settings';
import { TimerSettingsTab } from 'src/settings-tab';
import { Mode, TimeKeeper } from './time-keeper-data';
import { BreakModal, PauseTaskModal, StartTaskModal } from "./modal-data";

export default class CustomTimerPlugin extends Plugin {
	settings: TimerSettings;

	timeKeeper: TimeKeeper;
	statusClock: HTMLElement;
// #region --> Plugin setup
	async onload() {
		console.log("Loading Custom Timer plugin");
		await this.loadSettings();

		this.initClock();
		/* 
		- TODO: Static Tasks doesnt work;
		- TODO: Make modal prettier
		- TODO: Implement Countdown
		- TODO: Implement more than one timer.
		*/
		this.addCommand({
			id: 'start-task-command',
			name: 'Start Task',
			checkCallback: (checking: boolean) => {
				if(this.timeKeeper.mode == Mode.CLOCK){
					if(!checking){
						new StartTaskModal(this.app, this).open();
					}
					return true;
				}else{
					return false;
				}
			},
			hotkeys: []
		});

		this.addCommand({
			id: 'pause-command',
			name: 'Pause',
			checkCallback: (checking: boolean) => {
				if(this.timeKeeper.mode != Mode.CLOCK && this.timeKeeper.isRunning()){
					if(!checking){
						this.timeKeeper.pause('');
					}
					return true;
				}else{
					return false;
				}
			},
			hotkeys: []
		});

		this.addCommand({
			id: 'pause-reason-command',
			name: 'Pause with reason',
			checkCallback: (checking: boolean) => {
				if(this.timeKeeper.mode != Mode.CLOCK && this.timeKeeper.isRunning()){
					if(!checking){
						new PauseTaskModal(this.app, this).open();
					}
					return true;
				}else{
					return false;
				}
			},
			hotkeys: []
		});

		this.addCommand({
			id: 'break-command',
			name: 'Take a break',
			checkCallback: (checking: boolean) => {
				if(this.timeKeeper.mode == Mode.CLOCK && !this.timeKeeper.isRunning()){
					if(!checking){
						new BreakModal(this.app, this).open();
					}
					return true;
				}else{
					return false;
				}
			},
			hotkeys: []
		});

		this.addCommand({
			id: 'resume-command',
			name: 'Resume',
			checkCallback: (checking: boolean) => {
				if(this.timeKeeper.mode != Mode.CLOCK && this.timeKeeper.isPaused){
					if(!checking){
						this.timeKeeper.resume();
					}
					return true;
				}else{
					return false;
				}
			},
			hotkeys: []
		});

		this.addCommand({
			id: 'stop-timer-command',
			name: 'Stop Timer',
			checkCallback: (checking: boolean) => {
				if(this.timeKeeper.mode != Mode.CLOCK){
					if(!checking){
						this.timeKeeper.stop();
					}
					return true;
				}else{
					return false;
				}
			},
			hotkeys: []
		});

		this.addSettingTab(new TimerSettingsTab(this.app, this));		
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

// #endregion 

// #region --> Clock functions

	updateStatusClock() {
		if(this.settings.enableClock || this.timeKeeper.mode != Mode.CLOCK) {
			this.statusClock.setText(this.timeKeeper.update());
		}
	}

// #endregion

// #region --> Helper

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

	private initClock(){
		this.statusClock = this.addStatusBarItem();
		this.timeKeeper = new TimeKeeper(this);
		this.statusClock.setText(this.timeKeeper.update());

		if(this.settings.enableClock){
			this.showEl(this.statusClock);
		}else{
			this.hideEl(this.statusClock);
		}
		
		this.registerInterval(window.setInterval(() => this.updateStatusClock(), 1000));
	}
// #endregion
}


