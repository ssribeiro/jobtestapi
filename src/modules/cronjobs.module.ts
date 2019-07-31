import * as cron from 'cron'
import { error, ICronjob, logger } from '../'
import { cronjobs } from '../cronjobs'

export const CRONJOB_SUCCESS_MESSAGE = 'Cronjob executed with success: '
export const CRONJOB_FAILED_MESSAGE = 'Cronjob failed: '
export const DEFAULT_TIMEZONE = 'America/Sao_Paulo'

export interface ICronjobsModuleConfig {
    timezone?: string
}

interface ICronjobModuleState {
    jobs: cron.CronJob[]
    timezone: string
}

export const state: ICronjobModuleState = {
    jobs: [],
    timezone: DEFAULT_TIMEZONE,
}

const start = async () => {
    cronjobs.forEach((cronjob: ICronjob) => {
        // constructor(cronTime, onTick, onComplete, start, timezone, context, runOnInit, unrefTimeout
        const cronjobAdded: cron.CronJob = new cron.CronJob(
            cronjob.string,
            () => {
                cronjob
                    .job()
                    .then(() => {
                        logger.success(CRONJOB_SUCCESS_MESSAGE + cronjob.name)
                    })
                    .catch((e: Error) => {
                        error.op(CRONJOB_FAILED_MESSAGE + cronjob.name, { e })
                    })
            },
            undefined,
            true,
            state.timezone
        )
        state.jobs.push(cronjobAdded)
    })
}

const config = (cronjobsModuleConfig?: ICronjobsModuleConfig) => {
    if (cronjobsModuleConfig) {
        if (cronjobsModuleConfig.timezone) {
            state.timezone = cronjobsModuleConfig.timezone
        }
    }
}

const stop = async () => {
    for (const job of state.jobs) {
        await job.stop()
    }
    state.jobs = []
}

export const CronjobsModule = {
    config,
    start,
    stop,
}
