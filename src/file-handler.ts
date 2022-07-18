import { App, TFile, Vault } from "obsidian";
import TimerAddon from "./main";
import { Settings } from "./settings";
import { Moment } from 'moment';

export class FileHandler {
    settings: Settings;
    plugin: TimerAddon;
    app: App;
    vault: Vault;

    curFile: TFile;
    curFileMTime: number;
    curFileContent: string;
    curStartMoment: Moment;
    curEndMoment: Moment;

    constructor(plugin: TimerAddon){
        this.plugin = plugin;
        this.settings = plugin.settings;
        this.app = this.plugin.app;
        this.vault = this.app.vault;

        this.curFile = null;
        this.curFileContent = null;
        this.curStartMoment = null;
        this.curEndMoment = null;
        this.curFileMTime = -1;
    }


    getCurDate() : string{
        return window.moment().format(this.settings.dateFormat);
    }

    getCurTime() : string{
        return window.moment().format(this.settings.clockFormat);
    }

    getCurFileName() : string{
        // Cut off date in filename
        return this.curFile.basename.split(" ").reverse().splice(0, 2).reverse().join(" ");
    }

    getCurStart() : Moment{
        return this.curStartMoment;
    }

    getCurEnd() : Moment {
        return this.curEndMoment;
    }

    isFileFound() : boolean{
        return this.curFile != null;
    }

    async hasFileChanged() : Promise<boolean> {
        if(this.curFile == null || this.curFile == undefined || this.curFile.parent == null || this.curFile.stat.mtime != this.curFileMTime){
            this.plugin.eventKeeper.reset();
            return await this.foundNextEventFile();
        }

        return false;
    }

    async foundNextEventFile(): Promise<boolean>{
        const files = this.getFilesInEventDir();
        this.reset();
        this.curStartMoment = window.moment("00:01", "HH:mm");
        this.curEndMoment = window.moment("23:59", "HH:mm");

        if(files.length == 0){ // Directory is empty
            return false;
        }

        for(let i = 0; i < files.length; i++){
            // Parse file content into usable data
            const tmp_content = (await (this.vault.read(files[i])));
            if(!tmp_content.contains("startTime") || !tmp_content.contains("endTime")){ continue; }

            const tmp_start = this.extractKeyValue(tmp_content, "startTime");
            const tmp_startMoment = window.moment(tmp_start, "HH:mm");
            const tmp_startOffsetMoment = window.moment(tmp_start, "HH:mm").subtract(this.settings.minUntilTimerMode, "minutes");

            const tmp_end = this.extractKeyValue(tmp_content, "endTime");
            const tmp_endMoment = window.moment(tmp_end, "HH:mm");

            // Search for the nearest relevant event
            if(this.curEndMoment.isAfter(tmp_endMoment) && window.moment().isAfter(tmp_startOffsetMoment) && window.moment().isBefore(tmp_endMoment)){
                // Update best candidate for needed file
                this.curFileContent = tmp_content;
                this.curFile = files[i];
                this.curStartMoment = tmp_startMoment;
                this.curEndMoment = tmp_endMoment;
                this.curFileMTime = this.curFile.stat.mtime;
            }
        }

        return this.curFile != null;
    }

    reset(){
        this.curFile = null;
        this.curEndMoment = null;
        this.curFileContent = null;
        this.curStartMoment = null;
        this.curFileMTime = -1;
    }

    private extractKeyValue(file: string, key: string): string{
        return file.split('\n')
            .filter(l => l.startsWith(key))[0]
            .split(': ')
            .filter(e => !e.startsWith(key))
            .join();
    }

    private getFilesInEventDir(): TFile[]{
        // Filter out: files in other dir and old files
        return this.vault.getMarkdownFiles().filter(f => f.path.startsWith(this.settings.calendarPath) && f.basename.startsWith(this.getCurDate()));
    }
}