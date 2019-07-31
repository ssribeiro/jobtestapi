import { Service } from './'

Service.config({
    portalConfig: {
        host: process.env.JOBTEST_HOST_NAME || 'localhost',
        port: +(process.env.JOBTEST_SERVICE_PORT || 3000),
    },
    storeConfig: {
        plugin: 'mongo',
        pluginConfig: {
            db: process.env.MONGO_DATABASE || 'dev',
            host: process.env.MONGO_HOST || 'localhost',
            password: process.env.MONGO_PASSWORD || 'password',
            poolSize: +(process.env.MONGO_POOL_SIZE || 10),
            port: +(process.env.MONGO_PORT || 27017),
            username: process.env.MONGO_USERNAME || 'admin',
            // ssl: process.env.MONGO_USE_SSL || "false",
        },
    },
})

Service.start()

export { Service }
