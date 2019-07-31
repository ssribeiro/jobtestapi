/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import * as supertest from 'supertest'

import { ITrmPostRequest, logger, Portal, Service } from '../'

describe('Trm Api Feature', () => {
    let request: supertest.SuperTest<supertest.Test>

    before(async () => {
        process.env.JOBTEST_ENV = 'dev'
        Service.config({
            env: process.env.CEMENT_ENV === 'dev' ? 'dev' : 'prod',
            portalConfig: {
                host: process.env.CEMENT_PORTAL_HOST || 'localhost',
                port: +(process.env.CEMENT_PORTAL_PORT || 7001),
            },
            storeConfig: {
                plugin: 'mongo',
                pluginConfig: {
                    db: process.env.CEMENT_MONGO_DATABASE || 'dev',
                    host: process.env.CEMENT_MONGO_HOST || 'localhost',
                    password: process.env.CEMENT_MONGO_PASSWORD || 'password',
                    poolSize: +(process.env.CEMENT_MONGO_POOL_SIZE || 10),
                    port: +(process.env.CEMENT_MONGO_PORT || 27017),
                    username: process.env.CEMENT_MONGO_USERNAME || 'admin',
                    // ssl: process.env.MONGO_USE_SSL || "false",
                },
            },
        })
        await Service.start()
        request = supertest(Portal.getExpressApp())
    })

    after(async () => {
        await Service.stop()
    })

    const source = 'USD'
    const target = 'UYU'

    describe('Post Trm', () => {
        it('should respond ok for a call', done => {
            const trmPostRequest: ITrmPostRequest = { source, target }
            ;(request.post('/trm') as supertest.Test)
                .send(trmPostRequest)
                .expect(200)
                .end(err => {
                    expect(err).to.be.null
                    done()
                })
        })
    })

    describe('Get Trm', () => {
        it('should respond with data', done => {
            ;(request.get('/trm') as supertest.Test)
                .expect(200)
                .then(response => {
                    const r = response.body
                    expect(r.page).to.be.equal(0)
                    expect(r.total).to.be.an('number')
                    expect(r.results).to.be.an('array')
                    expect(r.results[0]).to.be.exist
                    expect(r.results[0]._id).to.be.not.exist
                    done()
                })
                .catch(err => {
                    logger.dev(err)
                    done()
                })
        })
    })
})
