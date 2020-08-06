import { AbstractJsonFileReadWriteService, ServiceProviderManager } from "@luisiseverywhere/dependency-injection/services";

const SETTINGS_FILE = "./config/settings.json";

export class SettingsFileService extends AbstractJsonFileReadWriteService {

    constructor(serviceManager: ServiceProviderManager) {
        super(serviceManager);
    }
    
    path(): string {
        return SETTINGS_FILE;
    }

}