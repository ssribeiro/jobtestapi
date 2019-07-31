/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import chalk from 'chalk'
import { spy } from 'sinon'
import { Service } from '../'

import { UpdateTrmTablesCronjob } from '../cronjobs/update-trm-tables.cronjob'
import {
    CRONJOB_SUCCESS_MESSAGE,
    CronjobsModule,
    state,
} from './cronjobs.module'

describe('Cronjobs Module', () => {
    after(async () => {
        await Service.stop()
    })
    it('should exist', () => {
        expect(CronjobsModule).to.be.exist
    })
    it('should config', done => {
        CronjobsModule.config()
        expect(CronjobsModule).to.be.exist
        CronjobsModule.config({ timezone: 'America/New_York' })
        expect(state.timezone).to.be.equals('America/New_York')
        CronjobsModule.config({ timezone: 'America/Sao_Paulo' })
        done()
    })
    it('execute cronjob', async () => {
        await CronjobsModule.start()
        expect(state.jobs).to.be.exist.an('array')
        expect(state.jobs[0]).to.be.exist
        const consoleLogSpy = spy(console, 'log')
        state.jobs[0].fireOnTick()
        await new Promise(r => setTimeout(r, 2000))
        consoleLogSpy.should.have.been.calledWith(
            chalk.green(CRONJOB_SUCCESS_MESSAGE + UpdateTrmTablesCronjob.name)
        )
        consoleLogSpy.restore()
    }).timeout(3000)
})
