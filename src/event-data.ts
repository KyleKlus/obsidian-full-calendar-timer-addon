import { Settings } from "./settings";
import { Duration, Moment } from 'moment';

export class Event {
    settings: Settings;
    name: string;

    started: boolean;
    
    startTime: Moment;
    endTime: Moment;

    totalDuration: Duration;
    untilStartDuration: Duration;
    untilEndDuration: Duration;

    constructor(settings: Settings, name: string, start:Moment, end:Moment){
        this.settings = settings;
        this.name = name;
        this.startTime = start;
        this.endTime = end;
        this.totalDuration = window.moment.duration(this.endTime.diff(this.startTime));
        this.update();
    }

    getName(): string{
        return this.name;
    }

    getStart(): Moment{
        return this.startTime;
    }

    getEnd(): Moment{
        return this.endTime;
    }

    getTotalDuration():Duration{
        return this.totalDuration;
    }

    getDurationUntilStart():Duration{
        return this.untilStartDuration;
    }

    getDurationUntilEnd():Duration{
        return this.untilEndDuration;
    }

    isStarted(): boolean{
        return this.started;
    }

    update(){
        this.untilEndDuration = window.moment.duration(this.endTime.diff(window.moment()));
        this.untilStartDuration = window.moment.duration(this.startTime.diff(window.moment()));
        this.started = window.moment().isBetween(this.startTime, this.endTime, "seconds" , "[)");
    }

    getTimerState(): string{
        let eventName = this.name;
        let neededDuration = this.getDurationUntilEnd();

        if (this.startTime.isAfter(window.moment())){
            neededDuration = this.getDurationUntilStart();
        }

        if(eventName.length > 15 ){
            eventName = eventName.substring(0, 15);
            eventName += '...';
        }

        return eventName + ': ' + this.parseDuration(neededDuration);
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