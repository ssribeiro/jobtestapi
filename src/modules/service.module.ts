// import * as fs from 'fs'
// import * as path from 'path'
import { error, logger } from '../'

import { PortalModule as Portal, StoreModule as Store } from './'

import { IPortalModuleConfig } from './portal.module'
import { IStoreModuleConfig } from './store.module'

export const NOT_ALLOWED_IN_PRODUCTION_ERROR = 'NOT_ALLOWED_IN_PRODUCTION_ERROR'

export interface IServiceModuleConfig {
    env?: 'dev' | 'prod'
    storeConfig?: IStoreModuleConfig
    portalConfig?: IPortalModuleConfig
}

interface IServiceModuleState {
    env: 'dev' | 'prod'
    storeConfig?: IStoreModuleConfig
    portalConfig?: IPortalModuleConfig
    startedAt?: number
}

const state: IServiceModuleState = {
    env: 'dev',
}

const config = (serviceConfig: IServiceModuleConfig) => {
    state.env = serviceConfig.env || 'dev'

    if (serviceConfig.storeConfig) {
        state.storeConfig = serviceConfig.storeConfig
    }
    if (serviceConfig.portalConfig) {
        state.portalConfig = serviceConfig.portalConfig
    }

    Store.config(state.storeConfig)
    Portal.config(state.portalConfig)
}

const start = async () => {
    if (!state.startedAt) {
        logger.log('starting service..')
        // PortalModule,
        // CronjobModule

        await Portal.start()

        state.startedAt = Date.now()
        logger.success('Service ' + ' started at ' + state.startedAt)
    }
}

const wipe = async () => {
    if (state.env !== 'dev') {
        error.throw(NOT_ALLOWED_IN_PRODUCTION_ERROR)
    } else {
        await Store.wipe()
        logger.warn('System Wiped By Developer')
    }
}

export const ServiceModule = {
    config,
    start,
    wipe,
}
