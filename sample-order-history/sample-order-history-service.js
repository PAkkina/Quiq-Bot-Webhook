const fs = require('fs');



exports.getOrders = () => {
    let obj;
    let promise = new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/sample-order-history.json`, 'utf8', function (err, data) {
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