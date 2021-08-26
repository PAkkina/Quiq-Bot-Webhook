const axios = require('axios');
const constants = require('../constants/constants')
const quiqResponseParser = require('../utils/quiq-response-parser')

exports.getOrderDetailByOrderNumberAndpostalCode = async (req, res, next) => {
    const postalCode = req.body.conversation.custom.zipCode;
    const orderNumber = req.body.conversation.custom.orderNumber;
    try {
        let response = await axios.get(`${constants.ORDER_DETAILS_API_URL}`, {
            params: {
                postalCode,
                orderNumber
            },
        });
        res.statusCode = 200;
        let responseObject = { actions: quiqResponseParser.createOrderDetailActions(response.data.orderDetailBean.orderData, postalCode, orderNumber), waitForCustomerResponseOverride: { shouldWait: false } }
        res.json(responseObject);
    }
    catch (e) {
        res.statusCode = 200;
        res.json({ actions: quiqResponseParser.createOrderDetailActions() });
        console.log(e);
    }

};