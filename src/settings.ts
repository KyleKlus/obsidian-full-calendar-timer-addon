export interface TimerSettings {
    enableClock: boolean;
    enableLog: boolean;
    logToDailyNote: boolean;

    startTag: string;
    unusedTag: string;
    stopTag: string;
    breakTag: string;
    cancelTag: string;
    taskTag: string;
    timerTag: string;
    stopWatchTag: string;
    clockTag: string;

    clockFormat: string;
    logFileName: string;
    dailyNoteFormat: string;
}

export const DEFAULT_SETTINGS: TimerSettings = {
    enableClock: true,
    enableLog: true,
    logToDailyNote: true,

    breakTag: 'BREAK',
    unusedTag: 'UNUSED',
    startTag: 'STARTED',
    stopTag: 'STOPPED',
    cancelTag: 'CANCELED',
    taskTag: 'TASK',
    timerTag: 'TIMER',
    stopWatchTag: 'STOP WATCH',
    clockTag: 'CLOCK',

    clockFormat: 'HH:mm',
    logFileName: 'CustomTimerLog',
    dailyNoteFormat: 'DD.MM.YYYY'
}