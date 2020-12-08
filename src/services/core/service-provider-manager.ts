import { ServiceProvider } from "./service-provider";

/**
 * A class that allows registration and retrieval of services.
 */
export class ServiceProviderManager {

    private services: ServiceRegistration[] = [];

    constructor() {
    }

    /**
     * Register a service provider based on class name.
     * e.g FileSystem instance provided will be available as 'FileSystem' service.
     * @param service the instance to be used as service provider
     */
    register(service: ServiceProvider) {
        service.provides().forEach(name => {
            service.setServices(this);
            this.services.push({
                name: name,
                provider: service
            });
        });
    }

    /**
     * Returns the first available provider for a required service.
     * If generic type provided it will cast instance to provided type.
     * @param name the type of the provider (class).
     */
    resolve<T extends ServiceProvider>(type: Function): T {
        const service = this.services.find(service => service.name === type.name);
        if (service) {
            return <T>(service.provider);
        } else {
            return null;
        }
    }
    
    /**
     * Return unique service names available
     */
    serviceNames(): string[] {
        const names = this.services.map(service => service.name);
        return [...new Set(names)];
    }

    /**
     * Returns all providers for a specific service
     * @param type class type/name that provide specified service
     */
    providers(type: Function): any[] {
        return this.services
            .filter(service => service.name === type.name)
            .map(service => service.provider);
    }
}

interface ServiceRegistration {
    name: string;
    provider: any;
}