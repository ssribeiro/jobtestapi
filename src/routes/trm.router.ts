import * as express from 'express'
import { ITrmRateData, JobtestError, logger, Trm } from '../'

export const SUCCESS_MESSAGE = 'SUCCESS'

const trmRouter = express.Router()
trmRouter.post('/', (req: express.Request, res: express.Response) => {
    logger.dev('GOT REQUEST: ', req.body)
    const source = req.body.source
    const target = req.body.target
    try {
        Trm.updateTablesForCurrency(
            Trm.validateCurrencyCode(source),
            Trm.validateCurrencyCode(target)
        )
            .then(() => {
                res.statusCode = 200
                res.send(SUCCESS_MESSAGE)
            })
            .catch((e: JobtestError) => {
                res.statusCode = 500
                res.send(e)
            })
    } catch (e) {
        res.statusCode = 400
        res.send(e)
    }
})

trmRouter.get('/', (req: express.Request, res: express.Response) => {
    logger.dev('GOT REQUEST: ', req.body)
    const page = req.query.page || 0
    const limit = req.query.limit || 30
    Trm.retrievePastStoredRates(page, limit)
        .then((pastValues: ITrmRateData) => {
            res.statusCode = 200
            res.send(pastValues)
        })
        .catch((e: Error) => {
            res.statusCode = 500
            res.send(e)
        })
})

export { trmRouter }
