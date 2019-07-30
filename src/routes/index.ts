import * as express from 'express'

import { trmRouter } from './trm.router'

const router = express.Router()

// include routers
router.use('/trm', trmRouter)

export {
  router,
}
