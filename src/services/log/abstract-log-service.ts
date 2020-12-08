import { ServiceProvider } from "../core/service-provider"

export abstract class AbstractLogService extends ServiceProvider {
    abstract log(args: any);
}