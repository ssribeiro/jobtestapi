export interface ICronjob {
  name: string,
  string: string,
  job: () => Promise<void>
}
