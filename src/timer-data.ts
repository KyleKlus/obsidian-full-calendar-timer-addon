import { TimerSettings } from "./settings";
import { Mode } from "./time-keeper-data";
import { Duration, Moment } from 'moment';

export class Timer {
    settings: TimerSettings;
    name: string;
    tag: string;

    mode: Mode;

    isStarted: boolean;
    isStopped: boolean;
    isCanceled: boolean;
    
    startTime: Moment;
    endTime: Moment;

    duration: Duration;

    offset: Duration;

    constructor(settings: TimerSettings, name: string, mode: Mode){
        this.settings = settings;
        this.mode = mode;
        switch(this.mode){
            case Mode.CLOCK:
                this.tag = this.settings.clockTag;
                break;
            case Mode.DYNAMIC_TIMER:
                this.tag = this.settings.timerTag;
                break;
            case Mode.BREAK:
                this.tag = this.settings.breakTag;
                break;
            case Mode.STATIC_TIMER:
                this.tag = this.settings.timerTag;
                break;
            case Mode.COUNTDOWN:
                this.tag = this.settings.timerTag;
                break;
            case Mode.STOP_WATCH:
                this.tag = this.settings.stopWatchTag;
                break;
        }
        this.isStarted = false;
        this.isCanceled = false;
        this.isStopped = false;
        this.name = name;
        this.offset = window.moment.duration(0, 'seconds');
    }

    start(){
        if(this.isStartPossible()){
            this.startTime = window.moment();
            this.isStarted = true;
        }
    }

    stop(){
        if(this.isStopPossible()){
            this.endTime = window.moment();
            this.duration = window.moment.duration(this.startTime.diff(this.endTime));
            this.isStarted = false;
            this.isStopped = true;
        }
    }

    cancel(){
        if(this.isCancelPossible){
            this.stop();
            this.isCanceled = true;
        }
        
    }

    setFinalDuration(){
        if(this.mode !== Mode.STATIC_TIMER || !this.isStopped){
            return;
        }

        this.duration = window.moment.duration(this.endTime.diff(this.startTime));
    }

    getDuration(){
        if((this.mode == Mode.DYNAMIC_TIMER || this.mode == Mode.BREAK) && !this.isStopped){
            return this.getDurationFromStart();
        }else if(this.mode == Mode.STATIC_TIMER && !this.isStopped){
            return this.getDurationTillEnd();
        }else{
            this.duration;
        }
    }

    getDurationFromStart(){
        if(!this.isStopped){
            this.duration = window.moment.duration(window.moment().diff(this.startTime));
        }
        return this.duration.subtract(this.offset);
    }

    getDurationTillEnd(){
        return this.duration = window.moment.duration(this.endTime.diff(window.moment())).add(this.offset);
    }

    isRunning(): boolean{
        return this.isStarted && !this.isStopped;
    }

    getTimerState(): string{
        let taskName = this.name;

        if(taskName.length > 15 ){
            taskName = taskName.substring(0, 15);
            taskName += '...';
        }
       
        return this.tag + ': ' + taskName + ' | ' + this.parseDuration(this.getDuration());
    }

    private isStartPossible(): boolean{
        return !this.isStarted && !this.isCanceled && !this.isStopped;
    }

    private isStopPossible(): boolean{
        return this.isStarted && !this.isCanceled && !this.isStopped;
    }

    private isCancelPossible(): boolean{
        return this.isStopPossible();
    }

    private parseDuration(duration: Duration): string{
        let state = duration.seconds().toString();
        if(duration.seconds() < 10){
            state = '0' + state;
        }

        if(duration.asSeconds() > 59){
            state = duration.minutes().toString() + ':' + state;
            if(duration.minutes() < 10){
                state = '0' + state;
            }
        }else{
            return state + ' s';
        }

        if(duration.asMinutes() > 59){
            state = duration.hours().toString() + ':' + state;
            if(duration.hours() < 10){
                state = '0' + state;
            }
        }else {
            return state + ' min';
        }

        if(duration.asHours() > 24){
            return duration.days().toString() + ' day(s)' + state + 'h';
        }else {
            return state + ' h';
        }
    }
}