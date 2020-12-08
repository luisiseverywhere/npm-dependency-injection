# npm package: @luisiseverywhere/dependency-injection
![Node.js CI](https://github.com/luisiseverywhere/npm-dependency-injection/workflows/Node.js%20CI/badge.svg?branch=master)

Simple implementation of Inversion of Control (IoC) pattern: Inject service providers into custom built-in DI (Dependency injection) service framework, and instances will be called when we need a specific service to be provided during runtime.

In our custom built-in DI all service providers will be based on ServiceProvider class, and our DI manager is used to retrieve or register services will be available via the ServiceProviderManager class. Only instances derived from ServiceProvider can be registered as a service provider in ServiceProviderManager.

#### Service Provider Manager (DI injector)

ServiceProviderManager is the facilitator that allows us to register the service providers to be available throughout the application lifetime, and to retrieve service providers during runtime when a certain service is required.

The available functionality as follows:

    interface ServiceProviderManager {
        register(service: ServiceProvider); 
        resolve<T extends ServiceProvider>(type: Function): T;
        serviceNames(): string[];
        providers(type: Function): any[];
    }

register(): Registers a service provider instance in the DI framework.

resolve(): Retrieves a single provider for a specific service. If multiple providers available for same service it will return the first available.

providers(): Retrieves a list of all providers available for a specified service.

serviceNames(): Populates a list of registered service providers in DI framework. Note that service provider names are based on class implementation names.

#### Service Provider
ServiceProvider class is the base class for any service implementation. 
It inherits from nodejs EventEmitter class, allowing subclass implementations to emit events specific to an implementation.

    export abstract class ServiceProvider extends EventEmitter {
        constructor();
        provides(): string[];
    }

The constructor accepts an instance of ServiceProviderManager (which should be unique within an application), which allows access to any service registered/available in DI framework.

The provides() function lists the names of its class and all intermediate subclass implementations, which is further used by the ServiceProviderManager to register which service it can provide.

Therefore, a service provider is register based on its class name (and subclasses) and can be later retrieved based on its type name.

## Install
    npm i @luisiseverywhere/dependency-injection
    
## How to create and add services
First step is to create your service(s) class which must derive from ServiceProvider class.
    
    import { ServiceProviderManager } from "@luisiseverywhere/dependency-injection/services";

    export class YourNewService extends ServiceProvider {
        doSomething(): void {
            
        }
    }
    
Second step is to register your service(s) 'YourNewService' in ServiceProviderManager. 
Easiest way is to use automatic loading from folder mechanism using the start(options) function and providing an array of folders from where to load your services. In example below, your YourNewService service would be placed in folder ./plugins

    import { DepencyInjectionFramework } from "@luisiseverywhere/dependency-injection";
    
    const di = DepencyInjectionFramework();
    di.start({
            loadPluginsFrom: [
                `${__dirname}/plugins`
            ],
            debugOn: true
        });
        
Alternative is to register services manually:

    di.serviceProviderManager().register(YourServiceProvider);
    
Now to retrieve the service, one can use the resolve() method as follows:
    
    const myProvider = di.serviceProviderManager().resolve<YourServiceProvider>(YourServiceProvider);
    
## Events
One can listen to three different events:
 - AfterLoad: triggered when all plugins are loaded from specified folders. you can safely use your registered services after this event has been emitted.
 - BeforeLoad: triggered before starting plugin loading from specified folder(s).
 - LoadError: when an error occurred initializing DI framework
    
Use enum EventName to define the event listener.

    import { EventName } from "@luisiseverywhere/dependency-injection/models";
    ..
    const di = DepencyInjectionFramework();
    ..
    di.on(EventName.AfterLoad, (sm: ServiceManagerProvider) => {
       // do something 
    });
    
## Default Services Availble
There are some default pre-installed services that are also available during runtime:

Logging service, enhances console.log() with a date and file name print. Aslo allows to enable/disable logging during runtime:

    const logger = di.serviceProviderManager().resolve<LogService>(LogService);
    logger.setEnabled(true);

File system service, allowing to read/write text to file, check if file exists and list the files within a folder recursively:
    
    const file = di.serviceProviderManager().resolve<FileSystemService>(FileSystemService);
    await file.list('folder');
    await file.write(JSON.stringify({test: true}), 'file-path');
    const text = await file.read('file-path');
    const ok = await file.exists('file-path');
    
## How To use
Code example at:
https://github.com/luisiseverywhere/npm-dependency-injection/tree/master/example

The basic tree structure as follow:

    ├── src
    │   ├── config
    │   │   ├── settings.json
    │   ├── plugins
    │   │   ├── settings-file.service.ts
    │   ├── main.ts
    │   ├── your-program.cs
    └── package.json

In this example we will be using main.ts as application entry point, where we instanciate our DI framework.
your-program.ts will be a your own app implementation, making use of DI framework and its registered services providers.

A new service class was created, called settings-file-service, and placed inside plugins folder. It will be automatically registered in DI framework and available when AfterLoad event has been called:

    import { DepencyInjectionFramework } from "@luisiseverywhere/dependency-injection";
    import { ServiceProviderManager } from '@luisiseverywhere/dependency-injection/services';
    import { EventName } from "@luisiseverywhere/dependency-injection/models";
    import { exit } from "process";
    import { YourProgram } from "./your-program";
    
    let application = new DepencyInjectionFramework();
    
    console.log("loading from", `${__dirname}/plugins`);
    application
        .on(EventName.LoadError, (error) => {
            console.log("\n** load error **", error);
            setTimeout(_=> exit(), 2000);
        })
        .on(EventName.BeforeLoad, ()  => {    
            console.log("\n** before load **");
        })
        .on(EventName.AfterLoad, (serviceManager: ServiceProviderManager) => {
            console.log("\n ** after load **");
            //
            // Execute your code in another class and access services using service manager
            new YourProgram(serviceManager);
        })
        .start({
            loadPluginsFrom: [
                `${__dirname}/plugins`
            ],
            debugOn: true
        });

YourProgram class could now make use of DI framework, and use the new service SettingsFileService:

    import { ServiceProviderManager } from "@luisiseverywhere/dependency-injection/services";
    import { SettingsFileService } from "./plugins/settings-file-service";
    
    export class YourProgram {
    
        constructor(serviceManager: ServiceProviderManager) {
            const provider = serviceManager.resolve<SettingsFileService>(SettingsFileService);
            provider.read().then((settings: YourAppSettings) => {
                console.log("\n build: ", settings.buildNumber, "\n version:", settings.version);
    
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
