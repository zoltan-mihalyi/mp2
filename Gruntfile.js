module.exports = function (grunt) {
    grunt.initConfig({
            typescript: {
                node: {
                    src: ['src/**/*.ts','test/**/*.ts'],
                    dest: 'target/node',
                    options: {
                        module: 'commonjs', //or commonjs
                        target: 'es3', //or es3
                        basePath: '',
                        sourceMap: true,
                        declaration: false,
                        noImplicitAny: true
                    }
                },
                browser: {
                    src: ['src/**/*.ts','test/**/*.ts'],
                    dest: 'target/browser',
                    options: {
                        module: 'amd', //or commonjs
                        target: 'es3', //or es3
                        basePath: '',
                        sourceMap: true,
                        declaration: false
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('default', ['typescript:browser']);
};