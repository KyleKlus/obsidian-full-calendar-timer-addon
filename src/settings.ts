export interface Settings {
    enableTimerMode: boolean;
    enableNotifications: boolean;

    minUntilTimerMode: string;

    breakTag: string;
    timerTag: string;
    clockTag: string;

    clockFormat: string;
    calendarPath: string;
    logFileName: string;
    dateFormat: string;
}

export const DEFAULT_SETTINGS: Settings = {
    enableTimerMode: true,
    enableNotifications: true,

    minUntilTimerMode: '10',

    breakTag: 'BREAK',
    timerTag: 'TIMER',
    clockTag: 'CLOCK',

    clockFormat: 'HH:mm',
    calendarPath: '/',
    logFileName: 'CustomTimerLog',
    dateFormat: 'DD-MM-YYYY'
}