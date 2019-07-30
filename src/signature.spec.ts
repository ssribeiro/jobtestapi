/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { signature } from './signature'

describe('signature', () => {
    it('should exist', () => {
        expect(signature).to.be.exist
        expect(+signature.jobtest_loaded_at).to.an('number')
        expect(signature.jobtest_version).to.be.an('string')
    })
})
