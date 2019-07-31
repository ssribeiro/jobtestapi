import { Db, MongoClient, Server } from 'mongodb'

import { error, logger } from '../'

export const NO_DB_ERROR = 'NO_DB_ERROR'
export const VOID_DB = new Db('void', new Server('voidhost', 1))
export const TIMEOUT_WAITING_FOR_DB_AVAILABLE = 10
// export const REST_TIME_FOR_TRYING_AGAIN_CONNECTION_WITH_DB: number = 500

export const DEFAULT_MONGO_OPTIONS = {
    db: 'jobtest',
    host: 'localhost',
    password: 'password',
    poolSize: 10,
    port: 27017,
    username: 'admin',
}
export const DEFAULT_MONGO_URL = 'mongodb://admin:password@localhost:27017'

export interface IStoreModuleConfig {
    plugin?: 'mongo' | 'none'
    pluginConfig?: IMongoPluginConfig | undefined
}

export interface IMongoPluginConfig {
    db?: string
    host?: string
    password?: string
    poolSize?: number
    port?: number
    // ssl: process.env.MONGO_USE_SSL || "false",
    username?: string
}

interface IStoreModuleState {
    startedAt?: number
    mongoClient?: MongoClient
    mongoUrl: string
    mongoOptions: IMongoPluginConfig
    plugin: 'mongo' | 'none'
    db?: Db
}

export const state: IStoreModuleState = {
    mongoOptions: DEFAULT_MONGO_OPTIONS,
    mongoUrl: DEFAULT_MONGO_URL,
    plugin: 'mongo',
}

const config = (storeConfig?: IStoreModuleConfig) => {
    if (storeConfig) {
        if (storeConfig.plugin) {
            state.plugin = storeConfig.plugin
        }
        if (storeConfig.pluginConfig) {
            if (storeConfig.pluginConfig.db) {
                state.mongoOptions.db = storeConfig.pluginConfig.db
            }
            if (storeConfig.pluginConfig.host) {
                state.mongoOptions.host = storeConfig.pluginConfig.host
            }
            if (storeConfig.pluginConfig.port) {
                state.mongoOptions.port = storeConfig.pluginConfig.port
            }
            if (storeConfig.pluginConfig.username) {
                state.mongoOptions.username = storeConfig.pluginConfig.username
            }
            if (storeConfig.pluginConfig.password) {
                state.mongoOptions.password = storeConfig.pluginConfig.password
            }
            if (storeConfig.pluginConfig.poolSize) {
                state.mongoOptions.poolSize = storeConfig.pluginConfig.poolSize
            }
        }
    }
    state.mongoUrl =
        'mongodb://' +
        state.mongoOptions.username +
        ':' +
        state.mongoOptions.password +
        '@' +
        state.mongoOptions.host +
        ':' +
        state.mongoOptions.port
}

const start = async () => {
    if (!state.startedAt) {
        state.startedAt = Date.now()
        await connectStore() /*.catch(async e => {
            // try again after some time
            await new Promise(r =>
                setTimeout(r, REST_TIME_FOR_TRYING_AGAIN_CONNECTION_WITH_DB)
            )
            await connectStore().catch(error.fatal)
        })*/
        // await bakeDb()
        logger.success('connected to store')
    }
}

const stop = async () => {
    if (state.mongoClient) {
        state.mongoClient.removeAllListeners()
        await state.mongoClient.close()
        state.mongoClient = undefined
        state.db = undefined
        state.startedAt = undefined
    }
}

/* tslint:disable:no-shadowed-variable */
export const connectStore = async () => {
    if (state.mongoUrl && state.mongoOptions) {
        const client = await MongoClient.connect(state.mongoUrl, {
            poolSize: state.mongoOptions.poolSize,
        }).then((client: MongoClient) => {
            if (state.mongoOptions) {
                state.db = client.db(state.mongoOptions.db)
            }
            return client
        })

        state.mongoClient = client as MongoClient
    }
}

// const bakeDb = async () => {
//   if( process.env.CEMENT_ENV == "dev" ) await eraseDb()
//   logger.success('DB is ready')
// }

const eraseDb = async () => {
    if (!state.db) {
        await grantDbAvailable()
    }
    if (state.db) {
        state.db.dropDatabase()
    }
}

const getDb = async (): Promise<Db> => {
    await grantDbAvailable().catch(error.fatal)
    return state.db || VOID_DB
}

const grantDbAvailable = async () => {
    return new Promise((resolveToAvailableGranted, rejectToTimeoutError) => {
        if (state.db) {
            resolveToAvailableGranted()
        } else {
            if (!state.startedAt) {
                start().then(() => {
                    setTimeout(() => {
                        if (state.db) {
                            resolveToAvailableGranted()
                        }
                    }, TIMEOUT_WAITING_FOR_DB_AVAILABLE)
                })
                // } else {
                //     setTimeout(() => {
                //         if (state.db) {
                //             resolveToAvailableGranted()
                //         } else {
                //             rejectToTimeoutError(NO_DB_ERROR)
                //         }
                //     }, TIMEOUT_WAITING_FOR_DB_AVAILABLE)
            }
        }
    })
}

export const StoreModule = {
    config,
    getDb,
    start,
    stop,
    wipe: eraseDb,
}
