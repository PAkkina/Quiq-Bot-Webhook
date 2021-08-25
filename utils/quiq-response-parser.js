const constants = require('../constants/constants')

exports.createOrderDetailActions = (orderObj, zipCode, orderNumber) => {
    const { subOrders } = orderObj;
    const { items } = subOrders[0];
    const actions = items.map(item => {
        return createProductMessageAction(item, zipCode, orderNumber);
    });
    actions.unshift({
        action: "sendMessage",
        message: {
            default: {
                text : 'We found following items' 
            }
        }
    });
    return actions;
}


const createProductMessageAction = (orderItem, zipCode, orderNumber) => {
    return {
        action: "sendMessage",
        message: {
            default: {
                text : orderItem.productInformation.mediumName,
                card: {
                    title: "Please click to see your order details",
                    image: {
                        publicUrl: orderItem.productInformation.images[0].url
                    },
                    link: {
                        url: `${constants.ORDER_TRACKING_PAGE_URL}?z0=${zipCode}&ordernum=${orderNumber}`
                    }
                },
            }
        }
    }
}
