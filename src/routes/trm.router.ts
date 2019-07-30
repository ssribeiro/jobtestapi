import * as express from 'express'
import { JobtestError, Trm } from '../'

export const SUCCESS_MESSAGE = 'SUCCESS'

const trmRouter = express.Router()
trmRouter.post('/', (req: express.Request, res: express.Response) => {
    let source = req.body.source
    let target = req.body.target
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

/*trmRouter.get('/', (req: express.Request, res: express.Response) => {
    logger.dev('GOT REQUEST: ', req.body)
    Command.execute(command, req.body)
        .then((ans: any) => res.status(200).send(ans))
        .catch((err: CementError) => {
            logger.dev(err)
            if (err.details) {
                if (err.details[0]) {
                    if (err.details[0].isOperational) {
                        res.status(err.details[0].statusCode || 500).send(
                            err.message
                        )
                        return
                    }
                }
            }
            error.op(err)
            res.status(500).send(err.message)
        })
})*/

export { trmRouter }
