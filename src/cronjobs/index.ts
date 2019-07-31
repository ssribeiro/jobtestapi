import { ICronjob } from '../interfaces'
import { UpdateTrmTablesCronjob } from './update-trm-tables.cronjob'

export const cronjobs: ICronjob[] = [UpdateTrmTablesCronjob]
