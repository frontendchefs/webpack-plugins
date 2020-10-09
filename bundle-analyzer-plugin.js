const babar = require('babar');
const fs = require('fs');
const path = require('path');

// Post Build Plugin for analyzing bundle sizes after the assets are emitted.

// using done hook

module.exports = class PostBuildPlugin {
    constructor(options) {
        this.options = options || {
            height: 10,
            width: 40,
            color: 'cyan'
        };

        this.postBuildProcess = this.postBuildProcess.bind(this);
    }

    /**
     * Function Called after build is done and assets are compied to folder.
     * @param {Object} stats 
     */
    
    postBuildProcess(stats) {
        const filePath = stats.compilation.options.output.path;
        const { height, width, color } = this.options;
        const data = [];
        let i = 0;

        fs.readdir(filePath, (error, files) => {
            if (error) throw error;

            files.forEach(file => {
                const { size } = fs.statSync(path.resolve(filePath, file));
                data.push([++i, size / 1000]);
            })
            console.log(babar(data, {
                color,
                width,
                height,
                yFractions: 1
            }));
        });
    }

    /**
     * 
     * @param {Tapable Instance} compiler 
     */

    apply(compiler) {
        compiler.hooks.done.tap("PostBuildPlugin", this.postBuildProcess);
    }
};