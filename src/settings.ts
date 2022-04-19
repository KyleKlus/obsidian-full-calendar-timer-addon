export interface Settings {
    enableTimerMode: boolean;

    minUntilTimerMode: string;

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
    calendarPath: string;
    logFileName: string;
    dateFormat: string;
}

export const DEFAULT_SETTINGS: Settings = {
    enableTimerMode: true,

    minUntilTimerMode: '10',

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
    calendarPath: '/',
    logFileName: 'CustomTimerLog',
    dateFormat: 'DD-MM-YYYY'
}