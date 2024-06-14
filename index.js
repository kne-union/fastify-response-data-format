const fp = require('fastify-plugin');
module.exports = fp(
  async function (fastify, options) {
    const { codeName, dataName, msgName, codePassValue } = Object.assign(
      {},
      {
        codeName: 'code',
        dataName: 'data',
        msgName: 'msg',
        codePassValue: 0
      },
      options
    );
    fastify.addHook('onSend', async (request, reply, payload) => {
      const contentType = reply.getHeader('content-type');
      if (contentType && contentType.indexOf('application/json') > -1) {
        const responseData = JSON.parse(payload);
        if (responseData.statusCode && (responseData.message || responseData.error)) {
          return JSON.stringify({
            [codeName]: responseData.statusCode,
            [msgName]: responseData.message || responseData.error
          });
        }
        return JSON.stringify({
          [codeName]: codePassValue,
          [dataName]: JSON.parse(payload)
        });
      }
      return payload;
    });
  },
  {
    name: 'fastify-response-data-format'
  }
);
