/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { Service } from './server'

describe('signature', () => {
    before(async () => {
        await Service.stop()
    })
    after(async () => {
        await Service.stop()
    })

    it('should exist', () => {
        expect(Service).to.be.exist
    })
})
