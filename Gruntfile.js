var fs = require('fs');

module.exports = function (grunt) {
    grunt.initConfig({
            typescript: {
                node: {
                    src: ['src/**/*.ts'],
                    dest: 'target/node',
                    options: {
                        module: 'commonjs', //or commonjs
                        target: 'es3', //or es3
                        basePath: 'src',
                        sourceMap: true,
                        declaration: true
                    }
                },
                browser: {
                    src: ['src/**/*.ts'],
                    dest: 'target/browser',
                    options: {
                        module: 'amd', //or commonjs
                        target: 'es3', //or es3
                        basePath: 'src',
                        sourceMap: true,
                        declaration: true
                    }
                }
            },
            dts: {
                browser: {
                    name: 'mp',
                    main: 'Main',
                    out: 'mp.d.ts',
                    src: ['target/browser/**/*.ts']
                },
                node: {
                    name: 'mp',
                    main: 'Main',
                    out: 'mp.d.ts',
                    src: ['target/node/**/*.ts']
                }
            },
            requirejs: {
                compile: {
                    options: {
                        baseUrl: "target/browser",
                        wrap: {
                            startFile: "build/wrap_before",
                            endFile: "build/wrap_after"
                        },
                        include: ['main-impl'],
                        name: "../../node_modules/almond/almond", // assumes a production build using almond
                        out: "mp.js",
                        optimize:'none'
                    }
                }
            }
        }
    );

    grunt.registerMultiTask('dts', function () {
        var result = [];

        this.filesSrc.forEach(function (file) {
            var content = fs.readFileSync(file, {
                encoding: 'utf-8'
            });
            var lines = content.split('\r\n');
            var combined = [];
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.indexOf('declare class') !== -1 || line.indexOf('declare var') !== -1) {
                    return; //file is not added
                }
                if (line.indexOf('/// <reference path=') !== -1) {
                    continue;
                }
                if (line === '') {
                    continue;
                }
                combined.push(line);
            }
            if (combined.length > 0) {
                result.push(combined.join('\r\n'));
            }

        });
        result.push('declare module "' + this.data.name + '"{var _:' + this.data.main + ';export=_}');
        fs.writeFileSync(this.data.out, result.join('\r\n'), {
            encoding: 'utf-8'
        });
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('node', ['typescript:node']);
    grunt.registerTask('browser', ['typescript:browser', 'requirejs', 'dts:browser']);
};