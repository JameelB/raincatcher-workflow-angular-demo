module.exports = {
  DONE_PREFIX: 'done:',
  WORKFLOWS: {
    CREATE: 'wfm:workflows:create',
    READ: 'wfm:workflows:read',
    UPDATE: 'wfm:workflows:update',
    DELETE: 'wfm:workflows:remove',
    LIST: 'wfm:workflows:list',
    STEP: {
      SUMMARY: 'wfm:workflows:step:summary',
      BEGIN: 'wfm:workflows:step:begin',
      COMPLETE: 'wfm:workflows:step:complete'
    }
  },
  WORKORDERS: {
    LIST: 'wfm:workorders:list'
  },
  RESULTS: {
    LIST: 'wfm:results:list'
  },
  APPFORMS: {
    LIST: 'wfm:appform:form:list'
  }
};