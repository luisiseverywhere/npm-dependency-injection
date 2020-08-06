import { DepencyInjectionFramework } from "@luisiseverywhere/dependency-injection";
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
    .on(EventName.AfterLoad, (serviceManager) => {
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