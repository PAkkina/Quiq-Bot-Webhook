const constants = require('../constants/constants')

exports.createOrderDetailActions = (orderObj, zipCode, orderNumber, contactPointId) => {
    const { subOrders } = orderObj;
    const { items } = subOrders[0];
    var deliveryStatus;
    const statusFound = subOrders[0].deliveryGroups[0].displaySteps.find( (step) => step.active );

    if (!statusFound) {
        deliveryStatus = statusFound.title;
    } else {
        deliveryStatus = "Delivered";
    }
       
    const actions = items.map(item => {
        console.log(item);
        return createProductMessageAction(item, zipCode, orderNumber, contactPointId, deliveryStatus);
    });
    actions.unshift({
        action: "sendMessage",
        message: {
            default: {
                text: 'We found following items'
            }
        }
    });
    addMandatoryActions(actions);
    const reducedActions = actions.reduce((prev, element, i) => {
        if (i < 6) {
            prev.push(element);
        }
        return prev;
    }, []);

    return reducedActions;
}

exports.createErrorActions = () => {
    const actions = [{
        action: "sendMessage",
        message: {
            default: {
                text: 'Something went wrong'
            }
        }
    }]
    addMandatoryActions(actions);
    return actions;
}


exports.createOrderNotFoundActions = () => {
    const actions = [{
        action: "sendMessage",
        message: {
            default: {
                text: `Sorry we couldn't find your order please make sure you entered the correct order number and postal code`
            }
        }
    }
    ]
    addMandatoryActions(actions);
    return actions;
}

const addMandatoryActions = (actions) => {
    return actions.unshift({
        action: "setField",
        field: "conversation.custom.zipCode",
        value: null
    }, {
        action: "setField",
        field: "conversation.custom.orderNumber",
        value: null
    });
}



const createProductMessageAction = (orderItem, zipCode, orderNumber, contactPointId, deliveryStatus) => {
    return {
        action: "sendMessage",
        message: {
            default: {
                text: orderItem.productInformation.mediumName,
                card: {
                    title: deliveryStatus,
                    subTitle: "Please click to see your order details",
                    image: {
                        publicUrl: orderItem.productInformation.images[0].url
                    },
                    link: {
                        url: `${constants.BRAND_HOSTNAMES[contactPointId]}${constants.ORDER_URLS.ORDER_TRACKING_PAGE_URL}?z0=${zipCode}&ordernum=${orderNumber}`
                    }
                },
            }
        }
    }
}



