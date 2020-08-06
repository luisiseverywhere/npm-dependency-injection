export interface DependencyInjectionOptions {
    /**
     * The folders path list from where service provider plugins shall be loaded
     */
    loadPluginsFrom?: string[];

    /**
     * Whether it should print info console prints
     */
    debugOn: boolean;

    /**
     * placeholder for any extra data that user may want to customize
     */
    data?: any;
}