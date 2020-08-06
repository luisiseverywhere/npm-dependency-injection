# @luisiseverywhere@dependency-injection


Simple implementation of Inversion of Control (IoC) pattern: Inject service providers into custom built-in DI (Dependency injection) service framework, and we will call those instances when we need a specific service to be provided during runtime.

In our custom built-in DI all service providers will be based on ServiceProvider class, and our DI manager is used to retrieve or register services will be available via the ServiceProviderManager class. Only instances derived from ServiceProvider can be registered as a service provider in ServiceProviderManager.

#### Service Provider
ServiceProvider class inherits from nodejs EventEmitter class. It allows then all subclass implements to trigger events specific to an implementation.

    export asbtract class ServiceProvider extends EventEmitter {
        constructor(serviceManager: ServiceProviderManager);
        provides(): string[];
    }

The constructor accepts an instance of ServiceProviderManager in order to any subclass implementation to have access to a service available in DI framework.

The provides() function lists the names of its class and all intermediate subclass implementations, which is further used by the ServiceProviderManager to register which service it can provide.

Therefore, a service provider is register based on its class name (and subclasses) and can be later retrieved based on its type name.

#### Service Provider Manager (DI injector)

ServiceProviderManager is the facilitator that allows us to register the service providers to be available throughout the application lifetime, and retrieve providers for usage during runtime when a certain service is required.

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


## Example

    Coming soon...
