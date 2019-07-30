/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { trmRouter } from './trm.router'

describe('TrmRouter interface', () => {
    it('should exist', () => {
        expect(trmRouter).to.be.exist
    })

    it('should has route post', () => {
        expect(trmRouter.stack[0].route.path).to.be.equals('/')
        expect(trmRouter.stack[0].route.stack[0].method).to.be.equals('post')
    })

    it('should has route get', () => {
        expect(trmRouter.stack[1].route.path).to.be.equals('/')
        expect(trmRouter.stack[1].route.stack[0].method).to.be.equals('get')
    })
})
