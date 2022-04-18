
import { FileHandler } from './file-handler';
import CustomTimerPlugin from './main';
import { TimerSettings } from './settings';
import { Timer } from './timer-data';

export enum Mode{
    CLOCK,
    DYNAMIC_TIMER,
    STATIC_TIMER,
    COUNTDOWN,
    STOP_WATCH,
    BREAK
}

export class TimeKeeper{
    plugin: CustomTimerPlugin;
    settings: TimerSettings;
    fileHandler: FileHandler;

    mode: Mode;
    isPaused: boolean;
    timerList: Timer[];
    aktTimer: Timer;

    endNotLog: boolean;

    constructor(plugin: CustomTimerPlugin){
        this.plugin = plugin;
        this.settings = plugin.settings;
        this.fileHandler = new FileHandler(this.plugin);
        this.timerList = [];
        this.mode = Mode.CLOCK;
        this.isPaused = false;
        this.endNotLog = false;
    }

    takeABreak(time: string){
        const start = window.moment().format('HH:mm').toString();
        if(!time.contains(':')){
            const newEnd = window.moment().add( parseInt(time), 'minutes');
            time = newEnd.format('HH:mm');
        }
        
        this.aktTimer = this.create(Mode.STATIC_TIMER, '');
        this.aktTimer.startTime = window.moment(start, 'HH:mm');
        this.aktTimer.endTime = window.moment(time, 'HH:mm');
        this.aktTimer.tag = this.settings.breakTag;
        this.aktTimer.isStarted = true;

        this.fileHandler.logToFile(this.aktTimer.tag, this.aktTimer.startTime.format('HH:mm'), this.aktTimer.name, '');

        if(this.aktTimer.startTime.diff(window.moment()) > 0){
            this.mode = Mode.CLOCK;
        } else {
            this.mode = this.aktTimer.mode;
        }
    }

    startTask(task: string, start: string, end: string){
        // TODO: implement timer start in the past?
        this.reset();
        if (end !== '' && start !== '') {
            if(!end.contains(':')){
                const newEnd = window.moment().add( parseInt(end), 'minutes');
                end = newEnd.format('HH:mm');
            }
            this.startStaticTask(task, start, end);
        } else if(start !== ''){
            this.startDynamicWithStartTask(task, start);
        } else if(end!== ''){
            start = window.moment().format('HH:mm').toString();
            if(!end.contains(':')){
                const newEnd = window.moment().add( parseInt(end), 'minutes');
                end = newEnd.format('HH:mm');
            }
            this.startStaticTask(task, start, end);
        }else{
            this.startDynamicTask(task);
        }
    }

    startDynamicTask(task: string){
        this.aktTimer = this.create(Mode.DYNAMIC_TIMER, task);
        this.aktTimer.tag = this.settings.taskTag;
        this.aktTimer.start();
        this.log(this.aktTimer, this.aktTimer.startTime.format('HH:mm'), 'Started:');
        this.mode = this.aktTimer.mode;
    }

    startDynamicWithStartTask(task: string, start: string){
        this.aktTimer = this.create(Mode.DYNAMIC_TIMER, task);
        this.aktTimer.startTime = window.moment(start, 'HH:mm');
        this.aktTimer.tag = this.settings.taskTag;
        this.aktTimer.isStarted = true;
        this.log(this.aktTimer, this.aktTimer.startTime.format('HH:mm'), 'Started:');

        if(this.aktTimer.startTime.diff(window.moment()) > 0){
            this.mode = Mode.CLOCK;
        } else {
            this.mode = this.aktTimer.mode;
        }
    }

    startStaticTask(task: string, start: string, end: string){
        this.aktTimer = this.create(Mode.STATIC_TIMER, task);
        this.aktTimer.startTime = window.moment(start, 'HH:mm');
        this.aktTimer.endTime = window.moment(end, 'HH:mm');
        this.aktTimer.tag = this.settings.taskTag;
        this.aktTimer.isStarted = true;

        this.fileHandler.logToFile(this.aktTimer.tag, this.aktTimer.startTime.format('HH:mm'), this.aktTimer.name, 'Started:');

        if(this.aktTimer.startTime.diff(window.moment()) > 0){
            this.mode = Mode.CLOCK;
        } else {
            this.mode = this.aktTimer.mode;
        }
    }

    pause(reason: string){
        if(!this.isPaused && this.isRunning()){
            this.timerList.push(this.create(Mode.BREAK, reason));
            this.timerList.last().start();
            this.log(this.timerList.last(), this.timerList.last().startTime.format('HH:mm'), '');
            this.isPaused = true;
            this.mode = Mode.BREAK;
            // TODO: implement move break if timer is static
        }
    }

    resume(){
        if(this.isPaused && this.aktTimer.isRunning){
            this.timerList.last().stop();
            this.log(this.aktTimer, this.timerList.last().endTime.format('HH:mm'), 'Resumed:');
            
            this.isPaused = false;
            this.mode = this.aktTimer.mode;
            // TODO: implement move break if timer is static
        }
    }

    stop(){
        if(this.aktTimer != null && this.aktTimer.isRunning()){
            this.aktTimer.stop();
            this.fileHandler.logToFile(this.settings.unusedTag, this.aktTimer.endTime.format('HH:mm'), '', '');
        }
        
        this.reset();
    }

    update() {
        switch(this.mode){
            case Mode.CLOCK:
                if(this.aktTimer != null && this.aktTimer.isRunning && this.aktTimer.startTime.diff(window.moment()) < 0){
                    this.mode = this.aktTimer.mode;
                }
                return this.settings.clockTag + ' | ' + window.moment().format(this.settings.clockFormat);
            case Mode.DYNAMIC_TIMER:
                return this.aktTimer.getTimerState();
            case Mode.STATIC_TIMER:
                if(!this.endNotLog && this.aktTimer != null && this.aktTimer.getDuration().abs().asSeconds() > 4 ){
                    this.fileHandler.logToFile(this.settings.unusedTag, this.aktTimer.endTime.format('HH:mm'), '', '');
                    this.endNotLog = true;
                }
                if(this.aktTimer.endTime.diff(window.moment()) < 0){
                    this.aktTimer.isStopped = true;
                    this.aktTimer.setFinalDuration();
                    this.reset();
                    this.mode = Mode.CLOCK;
                }
                return this.aktTimer.getTimerState() + ' left';
            case Mode.BREAK:
                return this.timerList.last().getTimerState();
            case Mode.COUNTDOWN:
                return ': ';
            case Mode.STOP_WATCH:
                return ': ';
        }
    }

    isRunning(): boolean{
        return this.aktTimer != null && this.aktTimer.isRunning && !this.isPaused;
    }

    private create(mode: Mode, name: string){
        return new Timer(this.settings, name, mode);
    }

    private async log(timer: Timer, time: string, status: string): Promise<boolean>{
        return await this.fileHandler.logToFile(timer.tag, time, timer.name, status);
    }

    private reset(){
        this.isPaused = false;
        this.timerList = [];
        this.aktTimer = null;
        this.mode = Mode.CLOCK;
        this.endNotLog = false;
        console.log('Reset Time Keeper');
    }
}
