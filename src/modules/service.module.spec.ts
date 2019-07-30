/* tslint:disable:no-unused-expression */
/* tslint:disable:no-reference */
/// <reference path="../../types/chai-like/index.d.ts" />

import { expect } from 'chai'
import { Portal } from '../'
import { ServiceModule, state } from './service.module'

describe('ServiceModule', () => {
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
            expect(state.serviceConfig.env).to.be.equal('dev')
        })

        it('should overide config', () => {
            ServiceModule.config({
                env: 'prod',
                portalConfig: {
                    host: 'somehttp',
                },
            })
            expect(state.serviceConfig.env).to.be.equal('prod')
            expect(Portal.getApiHost()).to.be.equal('somehttp')
        })
    })

    /*describe('routeSystem', () => {
        it('should create system routes', () => {
            ServiceModule.config()
            expect(state.expressApp._router.stack)
                .to.be.an('array')
                .that.contains.something.like({
                    regexp: /^\/system\/?(?=\/|$)/i,
                })
        })
    })

    it('should start', done => {
        ServiceModule.config()
        ServiceModule.start()
            .then(() => {
                expect(state.startedAt).to.be.at.least(Date.now() - 5000)
                done()
            })
            .catch((e: Error) => {
                expect(e).to.be.not.exist
                done()
            })
    }).timeout(5000)

    it('should fail restart', done => {
        process.env.JOBTEST_ENV = 'dev'
        ServiceModule.config()
        ServiceModule.start()
            .then(() => {
                expect(false).to.be.true
                done()
            })
            .catch((e: Error) => {
                expect(e).to.be.equals(ALREADY_STARTED_ERROR)
                ServiceModule.stop().then(done)
            })
    }).timeout(5000)
    */
})
