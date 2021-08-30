const constants = require('../constants/constants');
const axios = require('axios');
const quiqResponseParser = require('../utils/quiq-response-parser')

exports.getOrderDetailByOrderNumberAndpostalCode = async (req, res, next) => {
    const postalCode = req.body.conversation.custom.zipCode;
    const orderNumber = req.body.conversation.custom.orderNumber;
    const contactPointId = req.body.conversation.contactPointId;
    console.log(req.body);
    res.statusCode = 200;
    try {
        let response = await axios.get(`${constants.BRAND_HOSTNAMES[contactPointId]}${constants.ORDER_URLS.ORDER_DETAILS_API_URL}`, {
            params: {
                postalCode,
                orderNumber,
                contactPointId
            },
        });
        if (response.data.orderDetailBean.orderData) {
            let responseObject = { actions: quiqResponseParser.createOrderDetailActions(response.data.orderDetailBean.orderData, postalCode, orderNumber, contactPointId), waitForCustomerResponseOverride: { shouldWait: false } }
            res.json(responseObject);
        } else {

            let responseObject = { actions: quiqResponseParser.createOrderNotFoundActions(), waitForCustomerResponseOverride: { shouldWait: false } }
            res.json(responseObject);
        }
    }
    catch (e) {
        res.json({ actions: quiqResponseParser.createErrorActions() });
        console.log(e);
    }

};