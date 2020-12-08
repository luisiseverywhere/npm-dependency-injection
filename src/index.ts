import { EventEmitter } from "events";
import { ServiceProviderManager } from "./services/core/service-provider-manager";
import { FileSystemService } from "./services/file/file-system-service";
import { ServiceProvider } from "./services/core/service-provider";
import { DependencyInjectionOptions } from "./models/di-options-model";
import { EventName } from "./models/di-events-model";
import { LogService } from "./services/log/log-service";

export class DepencyInjectionFramework extends EventEmitter {

    private _serviceManager: ServiceProviderManager = new ServiceProviderManager();

    constructor() {
        super();
    }

    /**
     * Retrieve service provide manager
     */
    serviceProviderManager(): ServiceProviderManager {
        return this._serviceManager
    }

    /**
     * Starts dependency injection framework
     * @param options options for dependency injection DependencyInjectionOptions
     */
    public start(options: DependencyInjectionOptions = {debugOn: true, loadPluginsFrom: []}) {
        this.on(EventName.BeforeLoad, async () => {
            const logger = new LogService();
            logger.setEnabled(options.debugOn);
            this._serviceManager.register(logger);
            this._serviceManager.register(new FileSystemService());
            await this.load(options.loadPluginsFrom);
        })
        this.emit(EventName.BeforeLoad);
    }

    /**
     * Load the service providers modules from file.
     * One needs to provide the list of folders where to look for plugins. If no folder provider,
     * it will search by default in ./plugins folder
     * @param folders a list of folder from where to load the service provider plugins
     */
    private async load(folders: string[]) {
        if (!folders || folders.length === 0) {
            folders = [`${__dirname}/plugins`];
        }

        try {
            let promises: Promise<void>[] = [];
            folders.forEach(folder => promises.push(this.registerModulesFromFolder(folder, this._serviceManager)));
            await Promise.all(promises);
            
            this.emit(EventName.AfterLoad, this._serviceManager);
            this._serviceManager.resolve<LogService>(LogService).log(
                `Registered services:\n${JSON.stringify(this._serviceManager.serviceNames(), null, 2)}`
            );

        } catch (error) {
            this._serviceManager.resolve<LogService>(LogService).log(`Failed to start DI framework:\n${error}`);
            this.emit(EventName.LoadError, error);
        }
    }

    /**
     * Looks up for module in provided folder recursively, loads the module and registers in service provider.
     * @param folder the folder from where to load files from.
     * @param serviceManager service provider manager where to inject the services.
     */
    private async registerModulesFromFolder(folder: string, serviceManager: ServiceProviderManager): Promise<void> {
        return new Promise(async resolve => {
            const fileSystem = serviceManager.resolve<FileSystemService>(FileSystemService);

            const filePaths = await fileSystem.list(folder);
            filePaths
                .filter(path => {
                    const split = path.split('/');
                    const fileName = split[split.length - 1];
                    return  !fileName.includes('service-provider') &&
                            !fileName.includes('file-system')
                })
                .forEach(async path => {
                    this._serviceManager.resolve<LogService>(LogService).log(`importing module ${path} ...`);
                    const nodeModule = await import(path);
                    const className = Object.keys(nodeModule)[0];
                    try {
                        const provider: ServiceProvider = new nodeModule[className](serviceManager);
                        serviceManager.register(provider);  
                    } catch (error) {
                        this._serviceManager.resolve<LogService>(LogService).log(`Could not register provider ${className}:\n${error}`);
                    }
                });
    
            resolve();
        })
    }
}