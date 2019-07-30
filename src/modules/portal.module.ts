import { error, logger } from '../'

import { router as featureRouter } from '../routes'

import * as cors from 'cors'
import * as express from 'express'
import * as http from 'http'

export const ALREADY_STARTED_ERROR = 'SERVER ALREADY STARTED ERROR'

export interface IPortalModuleConfig {
    port?: number
    host?: string
}

interface IPortalModuleState {
    startedAt?: number
    port: number
    host: string
    expressApp: express.Express
    httpServer: http.Server | null
}

export const state: IPortalModuleState = {
    expressApp: express()
        .use(cors())
        .use(express.urlencoded({ extended: false }))
        .use(express.json()),
    host: 'localhost',
    httpServer: null,
    port: 3000,
}

const route = () => {
    routeSystem()
    routeFeatures()
}

const routeFeatures = () => {
    state.expressApp.use('/', featureRouter)
}

const routeSystem = () => {
    const router = express.Router()
    router.get('/ping', (req: express.Request, res: express.Response) => {
        res.send('pong from service jobtest')
    })
    state.expressApp.use('/system', router)
}

const start = async () => {
    if (!state.startedAt) {
        state.startedAt = Date.now()
        state.httpServer = http.createServer(state.expressApp)
        state.httpServer.on('error', error.fatal)
        state.httpServer.listen.apply(state.httpServer, [
            {
                host: state.host,
                port: state.port,
            },
        ])
        logger.log('listening on port: ' + state.port)
    } else {
        throw error.fatal(ALREADY_STARTED_ERROR)
    }
}

const stop = async () => {
    if (state.httpServer) {
        await state.httpServer.removeAllListeners()
        await state.httpServer.close()
        state.httpServer = null
        state.startedAt = undefined
    }
}

const config = (portalConfig?: IPortalModuleConfig) => {
    if (portalConfig) {
        if (portalConfig.port) {
            state.port = portalConfig.port
        }
        if (portalConfig.host) {
            state.host = portalConfig.host
        }
    }
    state.expressApp = express()
        .use(cors())
        .use(express.urlencoded({ extended: false }))
        .use(express.json())
    route()
}

const getApiPort = () => state.port
const getApiHost = () => state.host
const getExpressApp = () => state.expressApp

export const PortalModule = {
    config,
    getApiHost,
    getApiPort,
    getExpressApp,
    start,
    stop,
}
