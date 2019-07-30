/* tslint:disable:no-unused-expression */
/* tslint:disable:no-reference */
/// <reference path="../../types/chai-like/index.d.ts" />

import { expect } from 'chai'
import { Store } from "../"
import { ALREADY_STARTED_ERROR, PortalModule, state } from './portal.module'

describe('PortalModule', () => {

    after(async () => {
      await PortalModule.stop()
      await Store.stop()
    })

    it('should exist', () => {
        expect(PortalModule).to.be.exist
        expect(PortalModule.config).to.be.exist
        expect(PortalModule.getApiPort).to.be.exist
        expect(PortalModule.getExpressApp).to.be.exist
        expect(PortalModule.start).to.be.exist
    })

    describe('config', () => {
        it('should have default configuration', () => {
            expect(PortalModule.getApiPort()).to.be.equal(3000)
            expect(PortalModule.getApiHost()).to.be.equal('localhost')
        })

        it('should overide config', () => {
            PortalModule.config({
                host: 'testhost',
            })
            expect(state.host).to.be.equal('testhost')
            expect(state.port).to.be.equal(3000)
            PortalModule.config({
                host: 'someotherhost',
                port: 7000,
            })
            expect(PortalModule.getApiPort()).to.be.equal(7000)
            expect(PortalModule.getApiHost()).to.be.equal('someotherhost')
        })
    })

    describe('routeSystem', () => {
        it('should create system routes', () => {
            PortalModule.config()
            expect(state.expressApp._router.stack)
                .to.be.an('array')
                .that.contains.something.like({
                    regexp: /^\/system\/?(?=\/|$)/i,
                })
        })
    })

    it('should start', done => {
        PortalModule.config()
        PortalModule.start()
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
        PortalModule.config()
        PortalModule.start()
            .then(() => {
                expect(false).to.be.true
                done()
            })
            .catch((e: Error) => {
                expect(e).to.be.equals(ALREADY_STARTED_ERROR)
                PortalModule.stop().then(done)
            })
    }).timeout(5000)
})
