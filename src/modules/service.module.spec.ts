/* tslint:disable:no-unused-expression */
/* tslint:disable:no-reference */
/// <reference path="../../types/chai-like/index.d.ts" />

import { expect } from 'chai'
import { Portal, Store } from '../'
import { ServiceModule, state } from './service.module'

describe('ServiceModule', () => {
    before(done => {
        Store.stop().then(done)
        ServiceModule.config({
            env: 'dev',
            portalConfig: {
                host: 'localhost',
                port: 3000,
            },
            storeConfig: {
                plugin: 'mongo',
                pluginConfig: {
                    db: 'testjobdevtest',
                    host: 'localhost',
                    password: 'password',
                    port: 27017,
                    username: 'admin',
                },
            },
        })
    })

    after(done => {
        ServiceModule.stop()
            .then(done)
            .catch(e => {
                done()
            })
    })

    it('should exist', () => {
        expect(ServiceModule).to.be.exist
        expect(ServiceModule.config).to.be.exist
        expect(ServiceModule.wipe).to.be.exist
        expect(ServiceModule.start).to.be.exist
        expect(ServiceModule.stop).to.be.exist
    })

    describe('config', () => {
        it('should have default configuration', () => {
            expect(state.serviceConfig.env).to.be.oneOf(['dev', 'prod'])
        })

        it('should run config', () => {
            ServiceModule.config()
            expect(ServiceModule).to.be.exist
        })

        it('should overide config', () => {
            expect(ServiceModule).to.be.exist
            ServiceModule.config({
                env: 'prod',
                portalConfig: {
                    host: 'somehttp',
                },
            })
            expect(state.serviceConfig.env).to.be.equal('prod')
            expect(Portal.getApiHost()).to.be.equal('somehttp')
            ServiceModule.config({
                env: 'dev',
                portalConfig: {
                    host: 'localhost',
                },
            })
        })
    })

    it('should start', async () => {
        await ServiceModule.start().catch((e: Error) => {
            expect(e).to.be.not.exist
        })
        expect(state.startedAt).to.be.at.least(Date.now() - 5000)
    })

    it('should wipe', async () => {
        await ServiceModule.wipe().catch((e: Error) => {
            expect(e).to.be.not.exist
        })
    })

    it('should never wipe in production', async () => {
        ServiceModule.config({ env: 'prod' })
        await ServiceModule.wipe().catch((e: Error) => {
            expect(e).to.be.exist
        })
    })
})
