const axios = require('axios');
const constants = require('../constants/constants')
const quiqResponseParser = require('../utils/quiq-response-parser')

exports.getOrderDetailByOrderNumberAndpostalCode = async (req, res, next) => {
    const postalCode = req.body.conversation.custom.zipCode;
    const orderNumber = req.body.conversation.custom.orderNumber;
    res.statusCode = 200;
    try {
        let response = await axios.get(`${constants.ORDER_DETAILS_API_URL}`, {
            params: {
                postalCode,
                orderNumber
            },
        });
        let responseObject = { actions: quiqResponseParser.createOrderDetailActions(response.data.orderDetailBean.orderData, postalCode, orderNumber), waitForCustomerResponseOverride: { shouldWait: false } }
        res.json(responseObject);
    }
    catch (e) {
        res.json({ actions: quiqResponseParser.createErrorActions() });
        console.log(e);
    }

};