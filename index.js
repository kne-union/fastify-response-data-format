import fp from 'fastify-plugin';

const dataFormat = fp(
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
      if (contentType && payload && contentType.indexOf('application/json') > -1) {
        let responseData;
        try {
          responseData = JSON.parse(payload);
        } catch (e) {
          return {
            [codeName]: codePassValue,
            [dataName]: payload
          };
        }
        if (responseData.statusCode && (responseData.message || responseData.error)) {
          return JSON.stringify({
            [codeName]: Number.isInteger(Number(responseData.code)) ? Number(responseData.code) : responseData.statusCode || 500,
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

export default dataFormat;
