import { AbstractLogService } from "./abstract-log-service";

export class LogService extends AbstractLogService {
    private _nameOfClassWhereLogExecuted: string;
    private _isLogEnabled: boolean = true;

    constructor(nameOfClassWhereLogExecuted: string = '') {
        super();
        this._nameOfClassWhereLogExecuted = nameOfClassWhereLogExecuted;
    }

    isEnabled(): boolean {
        return this._isLogEnabled;
    }

    setEnabled(enabled: boolean) {
        this._isLogEnabled = enabled;
    }

    log(args: any): void {
        if (this._isLogEnabled) {
            let header = `${new Date().toLocaleString()} | `;
            if (!!this._nameOfClassWhereLogExecuted) {
                header += `${this._nameOfClassWhereLogExecuted} | `
            }
            console.log(header, args);
        }
    }
}