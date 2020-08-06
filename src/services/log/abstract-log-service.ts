import { ServiceProvider } from "../core/service-provider"
import { ServiceProviderManager } from "../core/service-provider-manager";

export abstract class AbstractLogService extends ServiceProvider {

    constructor(serviceManager: ServiceProviderManager) {
        super(serviceManager);
    }

    abstract log(args: any);
}