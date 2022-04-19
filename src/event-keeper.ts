import TimerAddon from './main';
import { Settings } from './settings';
import { Event } from './event-data';
import { App, Vault } from 'obsidian';
import { FileHandler } from './file-handler';

export enum Mode{
    CLOCK,
    TIMER,
    BREAK
}

export class EventKeeper{
    app: App;
    vault: Vault;
    plugin: TimerAddon;
    settings: Settings;
    fileHandler: FileHandler;

    mode: Mode;
    eventFound: boolean;
    curEvent: Event;

    constructor(plugin: TimerAddon){
        this.plugin = plugin;
        this.settings = plugin.settings;
        this.app = this.plugin.app;
        this.vault = this.app.vault;
        this.fileHandler = new FileHandler(plugin);

        this.mode = Mode.CLOCK;
        this.eventFound = false;
        this.curEvent = null;
    }
    
    async update() {
        if (this.isEventUpdateNeeded()) {
            this.curEvent = this.createEvent();

            if (this.curEvent == null){
                this.mode = Mode.CLOCK;
            } else {
                this.mode = Mode.TIMER;
            }
        } else {
            this.curEvent.update();
        }

        switch(this.mode){
            case Mode.CLOCK:
                return this.settings.clockTag + ' | ' + this.fileHandler.getCurTime();
            case Mode.TIMER:
                return this.settings.timerTag + " | " + this.curEvent.getTimerState();
            case Mode.BREAK:
                // TODO: implement break recognition
                return null;
        }
    }
        
    isRunning(): boolean{
        return this.curEvent != null && this.curEvent.isStarted();
    }

    reset(){
        this.curEvent = null;
        this.eventFound = false;
        this.mode = Mode.CLOCK;
    }

    private isEventUpdateNeeded(): boolean{
        // Reset if last event is over
        if(this.curEvent != null && this.curEvent.endTime.isBefore(window.moment())){
            this.reset();
            this.fileHandler.reset();
        }

        if(this.fileHandler.hasFileChanged()){  
            return true;
        }
        
        return false;
    }

    private createEvent(){
        if (!this.fileHandler.isFileFound()) {
            return null;
        }

        return new Event(this.settings, 
                        this.fileHandler.getCurFileName(), 
                        this.fileHandler.getCurStart(), 
                        this.fileHandler.getCurEnd());
    }
}
    