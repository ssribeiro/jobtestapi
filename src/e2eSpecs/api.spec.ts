/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import * as supertest from 'supertest'

import {
    Portal,
    Service,
    // Store,
    // EventStore,
} from '../'

describe('Api EndToEndTests', () => {
    let request: supertest.SuperTest<supertest.Test>

    after(async () => {
        await Service.stop()
    })

    it('should start', done => {
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

        Service.start().then(done)
    })

    describe('Service Ping', () => {
        before(async () => {
            Service.config({env: 'dev'})
            await Service.wipe()
            await Service.start()
            request = supertest(Portal.getExpressApp())
        })

        it('should start after wipe being called', () => {
            expect(Service).to.be.exist
        })

        it('should respond a ping', done => {
            ;(request.get('/system/ping') as supertest.Test)
                .expect(200, 'pong from service jobtest')
                .end(err => {
                    if (err) {
                        throw err
                    }
                    expect(err).to.be.null
                    done()
                })
        })
    })
})
