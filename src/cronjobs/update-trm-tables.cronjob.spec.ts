/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { Service } from '../'

import { UpdateTrmTablesCronjob } from './update-trm-tables.cronjob'

describe('UpdateTrmTablesCronjob', () => {
    after(async () => {
        await Service.stop()
    })
    it('should run', async () => {
        expect(UpdateTrmTablesCronjob.name).to.be.an('string')
        await UpdateTrmTablesCronjob.job()
        expect(true).to.be.true
    })
})
