import chalk from 'chalk'

export const logger = {
  log: (...args: any[]) => console.log(chalk.blue(...args)),
  success: (...args: any[]) => console.log(chalk.green(...args)),
  warn: (...args: any[]) => console.log(chalk.yellow(...args)),
  error: (...args: any[]) => console.log(chalk.red(...args)),
  dev: (...args: any[]) => {
    if(process.env.JOBTEST_ENV == 'dev') console.log(...args)
  },
}
