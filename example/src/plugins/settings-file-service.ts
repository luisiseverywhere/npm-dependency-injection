import { AbstractJsonFileReadWriteService } from "@luisiseverywhere/dependency-injection/services";

const SETTINGS_FILE = "./config/settings.json";

export class SettingsFileService extends AbstractJsonFileReadWriteService {
    path(): string {
        return SETTINGS_FILE;
    }
}