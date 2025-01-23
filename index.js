const fp = require('fastify-plugin');
module.exports = fp(
    async function (fastify, options) {
        const {codeName, dataName, msgName, codePassValue} = Object.assign(
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
            try {
                if (contentType && String(payload) !== '[object Object]' && contentType.indexOf('application/json') > -1) {
                    const responseData = JSON.parse(String(payload));
                    if (responseData?.statusCode && (responseData.message || responseData.error)) {
                        return JSON.stringify({
                            [codeName]: Number.isInteger(Number(responseData.code)) ? Number(responseData.code) : responseData.statusCode || 500,
                            [msgName]: responseData.message || responseData.error
                        });
                    }
                    return JSON.stringify({
                        [codeName]: codePassValue,
                        [dataName]: JSON.parse(String(payload))
                    });
                }
            } catch (e) {}
            return payload;
        });
    },
    {
        name: 'fastify-response-data-format'
    }
);
