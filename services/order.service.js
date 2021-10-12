const fs = require('fs');
const path = require('path');

exports.getOrderByIdAndZipCode = (orderNumber, postalCode) => {
    let obj;
    let promise = new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, `../sample-orders/${orderNumber}_${postalCode}.json`)
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                if (err.code == "ENOENT") {
                    resolve({
                        code: 404
                    })
                    return;
                }
                reject(err);
                return;
            }
            obj = JSON.parse(data);
            resolve(obj);
        });
    });
    return promise;
}

exports.getOrders = () => {
    let obj;
    let promise = new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '../sample-order-history/sample-order-history.json')
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                if (err.code == "ENOENT") {
                    resolve({
                        code: 404
                    })
                    return;
                }
                reject(err);
                return;
            }
            obj = JSON.parse(data);
            resolve(obj);
        });
    });
    return promise;
}