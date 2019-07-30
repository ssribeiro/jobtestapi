module.exports = function (w) {

  return {
    files: [
      { pattern: 'src/**/*.spec.ts', ignore: true },
      'src/**/*.ts'
    ],

    tests: [
      // { pattern: 'src/**/app.spec.ts', ignore: true },
      'src/**/*.spec.ts',
      'e2eSpecs/**/*.spec.ts'
    ],

    env: {
      type: 'node'
    },

    workers: {
      initial: 1,
      regular: 1,
      recycle: true,
    },

    // or any other supported testing framework:
    // https://wallabyjs.com/docs/integration/overview.html#supported-testing-frameworks
    testFramework: 'mocha',

    /*setup: (w) => {
      // const fs = require('fs');
      // fs.copyFileSync(w.localProjectDir+'/.env', w.projectCacheDir + '/.env');

      Object.keys(require.cache).filter(k => k.indexOf('sinon') >= 0)
        .forEach((k) => { delete require.cache[k]; });

      require("sinon");
      w.testFramework.DEFAULT_TIMEOUT_INTERVAL = 3000;
    }
    */

  };
};
