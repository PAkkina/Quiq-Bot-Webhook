const axios = require('axios');

exports.getOrderDetailByOrderNumberAndpostalCode = async (req, res, next) => {
    try {
        // let response = await axios.get(`https://uat3.potterybarn.com/customer-service/order-details/index.json?orderNumber=${req.conversation.custom.orderNumber}&postalCode=${req.conversation.custom.zipcode}`)
        let response = await axios({
            method: 'get',
            url: 'https://www.uat3.potterybarn.com/customer-service/order-details/index.json?orderNumber=902791172973&postalCode=94133&',
            auth: {
                username: `pbqaenv`,
                password: `Bl@ck2ye`
            }
        });
        console.log(response);
    }
    catch (e) {
        console.log(e);
    }
    res.statusCode = 200;
    res.json({
        actions: [
            {
                action: "sendMessage",
                message: {
                    default: {
                        text: "Found below mentioned items",
                        carousel: {
                            cards: [
                                {
                                    title: "Please click to see your order details",
                                    image: {
                                        publicUrl: "https://wsiadmin2-my.sharepoint.com/personal/pakkina_wsgc_com/Documents/Microsoft%20Teams%20Chat%20Files/img85l.jpeg"
                                    },
                                    link: {
                                        url: "https://www.google.com"
                                    }
                                },
                                {
                                    title: "Please click to see your order details",
                                    image: {
                                        publicUrl: "https://wsiadmin2-my.sharepoint.com/personal/pakkina_wsgc_com/Documents/Microsoft%20Teams%20Chat%20Files/img85l.jpeg"
                                    },
                                    link: {
                                        url: "https://www.google.com"
                                    }
                                }
                            ]
                        },
                    }
                }
            }
        ],
        waitForCustomerResponseOverride: {
            shouldWait: false
        }
    })
};