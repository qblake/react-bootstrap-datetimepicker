module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    transpile: {
      cjs: {
        type: 'cjs',
        files: [{
          expand: true,
          cwd: '.',
          src: ['transpiled/**/*.js'],
          dest: 'cjs/'
        }]
      },
      amd: {
        type: 'amd',
        anonymous: true,
        files: [{
          expand: true,
          cwd: '.',
          src: ['transpiled/**/*.js'],
          dest: 'amd/'
        }]
      }
    },

    es6_module_wrap_default: {
      cjs: {
        options: {
          type: 'cjs'
        },
        files: [{
          expand: true,
          cwd: 'cjs/transpiled',
          src: ['*.js'],
          dest: 'cjs'
        }]
      },
      amd: {
        options: {
          type: 'amd'
        },
        files: [{
          expand: true,
          cwd: 'amd/transpiled',
          src: ['*.js'],
          dest: 'amd'
        }]
      }
    },

    copy: {
      amd: {
        files: [
          {
            src: ['**/*'],
            dest: 'amd/',
            cwd: 'tools/amd',
            expand: true
          }
        ]
      },
      cjs: {
        files: [
          {
            src: ['**/*'],
            dest: 'cjs/',
            cwd: 'tools/cjs',
            expand: true
          }
        ]
      },
      options: {
        process: function (content, srcpath) {
          return grunt.template.process(content);
        }
      }
    },

    react: {
      src: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.*', '!coffee/*'],
            dest: 'transpiled',
            ext: '.js'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: 'test',
            src: ['**/*.*', '!coffee/*'],
            dest: 'test-built',
            ext: '.js'
          }
        ]
      }
    },

    clean: {
      transpiled: ['transpiled'],
      jsx: ['src/*.jsx'],
      cjs: ['cjs'],
      amd: ['amd'],
      test: ['test-built']
    },

    watch: {
      all: {
        files: [
          'src/**/*.coffee',
          'src/**/*.jsx.coffee',
          'test/**/*.jsx.coffee',
          'test/**/*.coffee'
        ],
        tasks: ['build'],
        options: {
          spawn: false
        }
      }
    },

    browserify: {
      test: {
        files: {
          'test_bundle.js': ['test-built/**/*.js']
        },
        options: {
          transform: ['envify'],
          verbose: true
        }
      }
     },

    requirejs: {
      dev: {
        // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {
          baseUrl: "amd",
          paths: {
            "react-bootstrap-datetimepicker": "./index",
            almond: "../tools/vendor/almond",
            react: "../tools/vendor/react-0.9.0"
          },
          include: ["almond", "react-bootstrap-datetimepicker"],
          exclude: ["react"],
          out: "amd/react-bootstrap-datetimepicker.js",
          wrap: {
            startFile: "tools/wrap.start",
            endFile: "tools/wrap.end"
          },
          optimize: "none"
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'amd/<%= pkg.name %>.js',
        dest: 'amd/<%= pkg.name %>.min.js'
      }
    },

    coffee: {
      options: {
        bare: true
      },

      src: {
        files: [
          {
            expand: true,
            cwd: 'src/coffee',
            src: ['**/*.jsx.coffee'],
            dest: 'src',
            ext: '.jsx'
          },
          {
            expand: true,
            cwd: 'src/coffee',
            src: ['**/*.coffee', '!**/*.jsx.coffee'],
            dest: 'src',
            ext: '.js'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: 'test/coffee',
            src: ['**/*.jsx.coffee'],
            dest: 'test',
            ext: '.jsx'
          },
          {
            expand: true,
            cwd: 'test/coffee',
            src: ['**/*.coffee', '!**/*.jsx.coffee'],
            dest: 'test',
            ext: '.js'
          }
        ]
      }

    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-es6-module-wrap-default');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('build', [
    'clean:amd',
    'clean:cjs',
    'clean:test',
    'coffee:src',
    'coffee:test',
    'react:src',
    'react:test',
    'transpile',
    'es6_module_wrap_default',
    'copy',
    'browserify:test',
    'requirejs:dev',
    'uglify:build',
    'clean:transpiled'
  ]);

  grunt.registerTask('default', ['build']);

};