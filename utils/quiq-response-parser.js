const constants = require('../constants/constants')


exports.createOrderHistoryActions = (orders, contactPointId) => {


    const actions = orders.map(order => {
        return createOrderMessageAction(order, contactPointId);
    });
    actions.unshift({
        action: "sendMessage",
        message: {
            default: {
                text: 'We found following orders'
            }
        }
    });
    // addMandatoryActions(actions);
    const reducedActions = actions.reduce((prev, element, i) => {
        if (i < 4) {
            prev.push(element);
        }
        return prev;
    }, []);

    return reducedActions;
}

exports.createOrderHistoryNotFoundActions = () => {
    const actions = [{
        action: "sendMessage",
        message: {
            default: {
                text: `Sorry we couldn't find any order against your account order please make sure you entered the correct order number and postal code`
            }
        }
    }
    ]
    // addMandatoryActions(actions);
    return actions;
}


exports.createOrderDetailActions = (orderObj, zipCode, orderNumber, contactPointId) => {
    const { subOrders } = orderObj;
    const { items, deliveryGroups } = subOrders && subOrders[0];
    const deliveryGroup = deliveryGroups && deliveryGroups[0];
    let statusFound, deliveryDate, trackingId;
    if (deliveryGroup) {
        statusFound = deliveryGroup && deliveryGroup.displaySteps && deliveryGroup.displaySteps.find((step) => step.active);
        deliveryDate = deliveryGroup && deliveryGroup.deliveryEstimate.displayDate;
        trackingId = deliveryGroup && deliveryGroup.packages && deliveryGroup.packages[0] && deliveryGroup.packages[0].tracking[0] && deliveryGroup.packages[0].tracking[0].id;
    }
    const deliveryStatus = statusFound ? statusFound.title : "Delivered";



    const actions = items.map(orderItem => {
        console.log(orderItem);
        return createProductMessageAction({ orderItem, zipCode, orderNumber, contactPointId, deliveryStatus, deliveryDate, trackingId });
    });
    actions.unshift({
        action: "sendMessage",
        message: {
            default: {
                text: 'We found following items'
            }
        }
    });
    // addMandatoryActions(actions);
    const reducedActions = actions.reduce((prev, element, i) => {
        if (i < 4) {
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
    // addMandatoryActions(actions);
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
    // addMandatoryActions(actions);
    return actions;
}

const addMandatoryActions = (actions) => {
    // return actions.unshift({
    //     action: "setField",
    //     field: "conversation.custom.zipCode",
    //     value: null
    // }, {
    //     action: "setField",
    //     field: "conversation.custom.orderNumber",
    //     value: null
    // });
}

const createOrderMessageAction = (orderInfo, contactPointId) => {
    const { orderNumber, postalCode } = orderInfo;
    return {
        action: "sendMessage",
        message: {
            default: {
                text: `Order#: ${orderNumber}`,
                card: {
                    title: `${orderInfo.displayDate}`,
                    subTitle: "Please click to see your order details",
                    image: {
                        publicUrl: ``
                    },
                    link: {
                        url: `${constants.BRAND_HOSTNAMES[contactPointId]}${constants.ORDER_URLS.ORDER_TRACKING_PAGE_URL}?z0=${postalCode}&ordernum=${orderNumber}`
                    }
                },
            }
        }
    }
}

const createProductMessageAction = (orderInfo) => {
    const { orderItem, zipCode, orderNumber, contactPointId, deliveryStatus, deliveryDate, trackingId } = orderInfo;
    return {
        action: "sendMessage",
        message: {
            default: {
                text: `${orderItem.productInformation.mediumName} ${trackingId ? trackingId : ''}`,
                card: {
                    title: `${deliveryStatus} ${deliveryDate}`,
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



