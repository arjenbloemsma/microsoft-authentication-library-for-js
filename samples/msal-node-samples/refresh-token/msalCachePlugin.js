/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const fs = require('fs');

/**
* Cache Plugin configuration
*/
module.exports = function (cacheLocation) {
    const beforeCacheAccess = (cacheContext) => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(cacheLocation)) {
                fs.readFile(cacheLocation, "utf-8", (error, data) => {
                    if (error) {
                        reject();
                    } else {
                        cacheContext.tokenCache.deserialize(data);
                        resolve();
                    }
                });
            } else {
                fs.writeFile(cacheLocation, cacheContext.tokenCache.serialize(), (error) => {
                    if (error) {
                        reject();
                    }
                });
            }
        });
    }

    const afterCacheAccess = (cacheContext) => {
        return new Promise((resolve, reject) => {
            if (cacheContext.cacheHasChanged) {
                fs.writeFile(cacheLocation, cacheContext.tokenCache.serialize(), (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    };


    return {
        beforeCacheAccess,
        afterCacheAccess
    }
}
