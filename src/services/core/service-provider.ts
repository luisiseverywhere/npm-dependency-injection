import { EventEmitter } from "events";
import { ServiceProviderManager } from "./service-provider-manager";

/**
 * A interface that allows a class to be added a service provider
 */
export abstract class ServiceProvider extends EventEmitter {

    protected serviceManager: ServiceProviderManager;

    constructor(serviceManager: ServiceProviderManager) {
        super();
        this.serviceManager = serviceManager;
    }

    /**
     * The services that can provide
     */
    provides(): string[] {
        return this.findBaseClassNames(this);
    }

    /**
     * Populate base classes to be register as a service provider.
     * loops through all super classes recursively.
     * @param service the 
     */
    private findBaseClassNames(service: ServiceProvider): string[] {
        let blacklistNames = ["ServiceProvider", "EventEmitter", "Object", "undefined", null];
        let names = []; 

        let baseClass = service;
        while (baseClass){
            const subClass = Object.getPrototypeOf(baseClass);
            if(!!subClass && !blacklistNames.includes(subClass.constructor.name)) {
                baseClass = subClass;
                names.push(subClass.constructor.name)
            } else{
                break;
            }
        }

        return names;
    }
}