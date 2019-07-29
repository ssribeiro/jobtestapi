/* tslint:disable:no-var-requires */
const jobtest = require(process.env.PWD + '/package.json')

const signature = {
    jobtest_loaded_at: Date.now(),
    jobtest_version: jobtest.version,
}

if (!process.env.JOBTEST_ENV) {
    process.env.JOBTEST_ENV = 'discovering'
}
process.env.JOBTEST_VERSION = signature.jobtest_version
process.env.JOBTEST_LOADED_AT = '' + signature.jobtest_loaded_at

export { signature }
