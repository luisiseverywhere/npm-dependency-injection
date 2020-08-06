import { ServiceProviderManager } from "@luisiseverywhere/dependency-injection/services";
import { SettingsFileService } from "./plugins/settings-file-service";
export class YourProgram {

    constructor(serviceManager: ServiceProviderManager) {
        
        const provider = serviceManager.resolve<SettingsFileService>(SettingsFileService);
        provider.read().then((settings: YourAppSettings) => {
            console.log("\nreading file data:\n", JSON.stringify(settings, null, 2));
            console.log("\nprinting YourAppSettings:\n build: ", settings.buildNumber, "\n version:", settings.version);

            this.init();
        })
    }

    init() {
        console.trace("\n** your code written here **");
    }
}

export interface YourAppSettings {
    buildNumber: number;
    version?: string;
    extra?: any; 
}