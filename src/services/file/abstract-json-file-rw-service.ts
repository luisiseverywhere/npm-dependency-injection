import { ServiceProvider } from "../core/service-provider";
import { ServiceProviderManager } from "../core/service-provider-manager";
import { FileSystemService } from "./file-system-service";


export abstract class AbstractJsonFileReadWriteService extends ServiceProvider {
    
    constructor(serviceManager: ServiceProviderManager) {
        super(serviceManager);
        this.serviceManager = serviceManager;
    }

    /**
     * Path of the file to be read
     */
    abstract path(): string;

    async write(data: {}, key?: string) {
        const fileService = this.validate();

        let json;

        if (!await fileService.exists(this.path())){
            json = data;

        } else {
            let json = await this.read();   
            const existingKeys = Object.keys(json);

            if (!key) {
                Object.keys(data).forEach(key => {
                    if (existingKeys.indexOf(key) > -1) {
                        json[key] = {
                            ...json[key],
                            ...data[key]
                        }
                    } else {
                        json = {
                            ...json,
                            ...data
                        };
                    }
                });
    
            } else {
                if (existingKeys.indexOf(key) > -1) {
                    json[key] = {
                        ...json[key],
                        ...data
                    };
                } else {
                    json = {
                        ...json,
                        [key]: data
                    } 
                }
            }
        }

        await fileService.write(this.path(), JSON.stringify(json, null, 2));
    }

    /**
     * Reads json data from a json file.
     * if not key specified, returns all document.
     * @param key 
     */
    async read(key?: string): Promise<any> {
        this.validate();

        const provider = this.serviceManager.resolve<FileSystemService>(FileSystemService);
        if(!provider) {
            throw new Error(`file service not available. can not read file ${this.path()}`);
        }

        const string = await provider.read(this.path());
        let json = JSON.parse(string);
        if (!key) {
            return json;
        } else {
            return !!json[key] ? json[key] : {};
        }
    }

    protected validate(): FileSystemService {
        if (!this.path().endsWith('json')) {
            throw new Error(`invalid file extension. must use '.json'`);
        }

        const provider = this.serviceManager.resolve<FileSystemService>(FileSystemService);
        if(!provider) {
            throw new Error(`file service not available. can not read file ${this.path()}`);
        }
        return provider;
    }
}