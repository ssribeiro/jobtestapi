import { expect } from 'chai';

import { logger } from "./logger";

describe("logger", () => {

  it("should have the error, warn, success and log functions", () => {
    expect(logger.error).to.be.exist;
    expect(logger.warn).to.be.exist;
    expect(logger.success).to.be.exist;
    expect(logger.log).to.be.exist;
  });

  it("should do error, warn, success and log", () => {
    logger.error('error will be like this')
    logger.warn('warn will be like this')
    logger.success('success will be like this')
    logger.log('log will be like this')
  });

});
