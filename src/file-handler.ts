import { App, normalizePath, TFile, Vault } from "obsidian";
import CustomTimerPlugin from "./main"
import { TimerSettings } from "./settings";


export class FileHandler{
    plugin: CustomTimerPlugin;
    settings: TimerSettings
    app: App;
    vault: Vault;

    timeRe: RegExp;

    lastLine: string;
    lastTime: string;
    isDayPlannerFound: boolean;

    constructor(plugin: CustomTimerPlugin){
        this.plugin = plugin;
        this.settings = this.plugin.settings;
        this.app = this.plugin.app;
        this.vault = this.app.vault;
        this.timeRe = new RegExp('.*([0-9][0-9]:[0-9][0-9]).*');
    }

    async logToFile(tag:string, time:string, name:string, duration:string): Promise<boolean>{
        if(!this.settings.enableLog){
            return false;
        }

        this.reset();

        let fileName: string;

        if(this.settings.logToDailyNote){
            fileName = window.moment().format(this.settings.dailyNoteFormat).toString();
        }else{
            fileName = this.settings.logFileName;
        }

        const file = this.getTFile(fileName);

        if(file == null){
            return false;
        }

        const content = await this.vault.cachedRead(file);
        console.log(content);
        //let lines = content.split('\n');
        //console.log(lines);
        this.vault.modify(file, await (await this.parseLines((await this.vault.cachedRead(file)).split('\n'), tag, time, name, duration)).join('\n'));
        /* console.log(lines);
        content = lines.join('\n');

        this.vault.modify(file, content);*/

        return true;
    }

    getTFile(fileName: string): TFile{
        fileName = normalizePath(fileName);
        return this.app.metadataCache.getFirstLinkpathDest(fileName, '');
    }

    private parseLines(lines: string[], tag: string, time: string, name: string, state: string): string[]{
        if (lines.contains(this.buildLogString(tag, time, name, state))){
            console.log('test');
            return lines;
        }


        let i;
        for(i = 0 ; i < lines.length ; i++){
            if(!this.isDayPlannerFound){
                this.isDayPlannerFound = lines[i].contains('# Day Planner'); 
                console.log('Day Planner found in line ' + i + ': ' + this.isDayPlannerFound);
                console.log(lines);
            } else if(this.isDayPlannerLine(lines[i])){
                const lineTime = this.timeRe.exec(lines[i])[1];
                const result = this.compareMoments(time, lineTime);
                console.log('Day Planner Line found in line ' + i);
                console.log(lines);
                if(lines[i].contains(this.settings.unusedTag) && result === 0){
                    console.log('Target line nr.: ' + i + ' found (Direct result)');
                    lines[i] = lines[i].replace(lineTime + ' BREAK', this.buildLogString(tag, time, name, state));
                    console.log(lines);
                    return lines;
                }
           
                if(this.isLastLineValid(tag, name, state)){
                    if(time === this.lastTime || time === lineTime){
                        console.log('No space before line nr.: ' + i);
                        console.log(lines);
                        break;
                    }
                    console.log(lines);
                    if(result < 0 && this.compareMoments(this.lastTime, time) < 0){
                        console.log('Target line nr.: ' + i + ' found (After search)');
                        console.log(lines);
                        console.log(lines.splice(i, 0, '- [ ] ' + this.buildLogString(tag, time, name, state)));
                        console.log(lines);
                        return lines;
                    }
                }
                
                this.lastLine = lines[i];
                this.lastTime = this.timeRe.exec(lines[i])[1];
            }
        }  

        console.log('No BREAK OR TASK FOUND thus now appending stuff');
        lines.push(this.buildLogString(tag, time, name, state));
        console.log(lines);
        return lines;
    }

    private buildLogString(tag: string, time: string, name: string, state: string): string{
        return time + ' ' + tag + ' ' + state + ' ' + name;
    }

    private compareMoments(first: string, second:string): number{
        const firstMoment = window.moment(first, 'HH:mm');
        const secondMoment = window.moment(second, 'HH:mm');

        if(firstMoment.diff(secondMoment, 'minutes') < 0){
            return -1;
        }else if(firstMoment.diff(secondMoment, 'minutes') > 0){
            return 1;
        }else{
            return firstMoment.diff(secondMoment, 'minutes');
        }
    }

    private isDayPlannerLine(line: string): boolean{
        return line.contains('- [') && this.timeRe.exec(line) != null;
    }

    private isLastLineValid(tag: string, name:string, state: string){
        return this.lastLine != null && this.hasLastLineTags(tag, name, state);
    }

    private hasLastLineTags(tag: string, name:string, state:string): boolean{
        return this.lastLine.contains(this.settings.unusedTag) || this.lastLine.contains('Started') || this.lastLine.contains('Resumed') || this.lastLine.contains(this.settings.breakTag);
    }

    private reset(){
        this.lastLine = null;
        this.lastTime = null;
        this.isDayPlannerFound = false;
    }
}