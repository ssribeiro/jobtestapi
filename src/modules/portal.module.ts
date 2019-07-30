import { error, logger } from '../'

import { router as featureRouter } from '../routes'

import * as cors from 'cors'
import * as express from 'express'
import * as http from 'http'

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

const state: IPortalModuleState = {
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
    }
}

const config = (portalConfig?: IPortalModuleConfig) => {
    if (portalConfig) {
        state.port = portalConfig.port || state.port
        state.host = portalConfig.host || state.host
    }
    route()
}

const getApiPort = () => state.port
const getExpressApp = () => state.expressApp

export const PortalModule = {
    config,
    getApiPort,
    getExpressApp,
    start,
}
