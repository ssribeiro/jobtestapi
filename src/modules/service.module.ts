// import * as fs from 'fs'
// import * as path from 'path'
import { error, logger } from '../'

import { PortalModule, StoreModule } from './'

import { IPortalModuleConfig } from './portal.module'
import { IStoreModuleConfig } from './store.module'

export const NOT_ALLOWED_IN_PRODUCTION_ERROR = 'NOT_ALLOWED_IN_PRODUCTION_ERROR'
// export const NOT_STARTED_ERROR = 'NOT_STARTED_ERROR'

export interface IServiceModuleConfig {
    env?: 'dev' | 'prod'
    storeConfig?: IStoreModuleConfig
    portalConfig?: IPortalModuleConfig
}

interface IServiceModuleState {
    serviceConfig: IServiceModuleConfig
    startedAt?: number
}

export const state: IServiceModuleState = {
    serviceConfig: { env: 'dev' },
}

const config = (serviceConfig?: IServiceModuleConfig) => {
    if (!serviceConfig) {
        serviceConfig = {}
    }
    state.serviceConfig.env = serviceConfig.env || 'dev'

    if (serviceConfig.storeConfig) {
        state.serviceConfig.storeConfig = serviceConfig.storeConfig
    }
    if (serviceConfig.portalConfig) {
        state.serviceConfig.portalConfig = serviceConfig.portalConfig
    }

    StoreModule.config(state.serviceConfig.storeConfig)
    PortalModule.config(state.serviceConfig.portalConfig)
}

const start = async () => {
    if (!state.startedAt) {
        logger.log('starting service..')
        // PortalModule,
        // CronjobModule

        await PortalModule.start()

        state.startedAt = Date.now()
        logger.success('Service ' + ' started at ' + state.startedAt)
    }
}

const stop = async () => {
    // if (state.startedAt) {
    await PortalModule.stop()
    await StoreModule.stop()
    state.startedAt = undefined
    /*} else {
        throw NOT_STARTED_ERROR
    }*/
}

const wipe = async () => {
    if (state.serviceConfig.env !== 'dev') {
        error.throw(NOT_ALLOWED_IN_PRODUCTION_ERROR)
    } else {
        await StoreModule.wipe()
        logger.warn('System Wiped By Developer')
    }
}

export const ServiceModule = {
    config,
    start,
    stop,
    wipe,
}
