/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { PortalModule, state } from './portal.module'

describe('PortalModule', () => {
    it('should exist', () => {
        expect(PortalModule).to.be.exist
        expect(PortalModule.config).to.be.exist
        expect(PortalModule.getApiPort).to.be.exist
        expect(PortalModule.getExpressApp).to.be.exist
        expect(PortalModule.start).to.be.exist
    })

    describe('config', () => {

      it('should have default configuration', () => {
        expect(state.host).to.be.equal('localhost')
        expect(state.port).to.be.equal(3000)
      })

      it('should overide config', () => {
        PortalModule.config({
          host: 'testhost'
        })
        expect(state.host).to.be.equal('testhost')
        expect(state.port).to.be.equal(3000)
        PortalModule.config({
          host: 'someotherhost',
          port: 7000
        })
        expect(state.host).to.be.equal('someotherhost')
        expect(state.port).to.be.equal(7000)
      })

    })

})
