import { App, Modal } from "obsidian";
import CustomTimerPlugin from "./main";

export class StartTaskModal extends Modal{
	plugin: CustomTimerPlugin;

	constructor(app: App, plugin: CustomTimerPlugin){
		super(app);
		this.plugin = plugin;
	}

	onOpen(): void {
		const {titleEl, contentEl} = this;
        
        titleEl.setText("Task Creator");

        const taskNameDiv = contentEl.createDiv();
        const taskStartDiv = contentEl.createDiv();
        const taskEndDiv = contentEl.createDiv();
        setTimeout(()=>{}, 1000);

		const name = createEl("input");
        name.focus();
        name.placeholder = 'Task Name';
        name.addEventListener('keyup', e =>{
            if(e.key.toString() === 'Enter' && this.isValid(name.value)){
                this.plugin.timeKeeper.startTask(name.value, start.value, end.value);
				this.close();
            }
        });

        const start = createEl("input");
        start.placeholder = 'Start Time';
        start.addEventListener('keyup', p =>{
            if(p.key.toString() === 'Enter' && this.isValid(name.value)){
                this.plugin.timeKeeper.startTask(name.value, start.value, end.value);
				this.close();
            }
        });

        const end = createEl("input");
        end.placeholder = 'End Time (in min or specific time)';
        end.addEventListener('keyup', c =>{
            if(c.key.toString() === 'Enter' && this.isValid(name.value)){
                this.plugin.timeKeeper.startTask(name.value, start.value, end.value);
				this.close();
            }
        });

        taskNameDiv.appendChild(name);
        taskStartDiv.appendChild(start);
        taskEndDiv.appendChild(end);
	}

	onClose(): void {
		this.containerEl.empty();
	}

    private isValid(name: string){
        return name != '';
    }
}

export class BreakModal extends Modal{
	plugin: CustomTimerPlugin;

	constructor(app: App, plugin: CustomTimerPlugin){
		super(app);
		this.plugin = plugin;
	}

	onOpen(): void {
		const {titleEl, contentEl} = this;
        
        titleEl.setText("Break Creator");
        setTimeout(()=>{}, 1000);

		const name = contentEl.createEl("input");
        name.focus();
        name.placeholder = 'Break time (in min or specific time)';
        name.addEventListener('keyup', e =>{
            if(e.key.toString() === 'Enter' && this.isValid(name.value)){
                this.plugin.timeKeeper.takeABreak(name.value);
				this.close();
            }
        });
	}

	onClose(): void {
		this.containerEl.empty();
	}

    private isValid(name: string){
        return name != '';
    }
}

export class PauseTaskModal extends Modal{
	plugin: CustomTimerPlugin;
	constructor(app: App, plugin: CustomTimerPlugin){
		super(app);
		this.plugin = plugin;
	}

	onOpen(): void {
		const {titleEl, contentEl} = this;
        titleEl.setText("Pause Reason?");

        setTimeout(()=>{}, 1000);

		const name = contentEl.createEl("input");
        name.focus();
        name.placeholder = 'Your reason.';
        name.addEventListener('keyup', e =>{
            if(e.key.toString() === 'Enter'){
                this.plugin.timeKeeper.pause(name.value);
				this.close();
            }
        });
	}

	onClose(): void {
		this.containerEl.empty();
	}
}