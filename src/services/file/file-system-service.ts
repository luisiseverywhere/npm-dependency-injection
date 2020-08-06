import { ServiceProvider } from "../core/service-provider";
import { ServiceProviderManager } from "../core/service-provider-manager";
import { LogService } from "../log/log-service";

const fs = require('fs');
const getFolderName = require('path').dirname;
const glob = require('glob');  

export class FileSystemService extends ServiceProvider {
    
    constructor(serviceManager: ServiceProviderManager) {
        super(serviceManager);
    }

    /**
     * List all file names in specific directory
     * @param folderName 
     */
    async list(folderName: string, fileType: string = ".js"): Promise<string[]> {
        return new Promise((resolve, reject) => {
            glob(`${folderName}/**/*${fileType}`, (error, files ) => {
                this.serviceManager.resolve<LogService>(LogService).log(`files loaded:\n${files}`);
                error ? reject(error) : resolve(files);
            });
        });
    }

    async read(path: string): Promise<string> {
        const exists = await this.exists(path);

        return new Promise((resolve, reject) => {
            if (!exists) {
                reject(`file ${path} does not exist`);
            } else {
                fs.readFile(
                    path, 
                    (error, result) => {
                        if (error) {
                            reject(`could not read file ${path}: ${error}`);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }
        });
    }

     write(path: string, data: string): Promise<boolean | string> {
        const folder = getFolderName(path);
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder);
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, error => {
                if(error) {
                    reject(`Could not write file ${path}`);
                } else {
                    resolve(true);
                }
            });
        });
    }

    exists(path: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.access(path, fs.constants.F_OK, (error) => {
                resolve(error ? false : true);
            });
        });
    }
}