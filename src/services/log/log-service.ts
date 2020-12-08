import { AbstractLogService } from "./abstract-log-service";

export class LogService extends AbstractLogService {
    
    private _isLogEnabled: boolean = true;

    isEnabled(): boolean {
        return this._isLogEnabled;
    }

    setEnabled(enabled: boolean) {
        this._isLogEnabled = enabled;
    }

    log(args: any): void {
        if (this._isLogEnabled) {
            const header = `${new Date().toLocaleString()} | ${__filename.replace(__dirname, "")} | `;
            console.info(header, args);
        }
    }
}