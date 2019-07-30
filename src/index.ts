import { signature } from './signature'
import { error, JobtestError } from './tools/error'
import { logger } from './tools/logger'

import {
  ICurrencyCode,
  ITrmRateEntry,
  ITrmRateList,
} from './interfaces'

import {
    PortalModule as Portal,
    ServiceModule as Service,
    StoreModule as Store,
    TrmModule as Trm,
} from './modules'

export {
    signature,
    logger,
    error,
    JobtestError,
    // interfaces
    ICurrencyCode,
    ITrmRateList,
    ITrmRateEntry,
    // Modules
    Service,
    Store,
    Portal,
    Trm
}
