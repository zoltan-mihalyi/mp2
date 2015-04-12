module.exports = function (grunt) {
    grunt.initConfig({
            typescript: {
                base: {
                    src: ['**/*.ts'],
                    dest: '',
                    options: {
                        module: 'amd', //or commonjs
                        target: 'es5', //or es3
                        basePath: 'path/to/typescript/files',
                        sourceMap: true,
                        declaration: true
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-typescript');
};