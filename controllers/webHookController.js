const axios = require('axios');
const constants = require('../constants/constants')
const quiqResponseParser = require('../utils/quiq-response-parser')

exports.getOrderDetailByOrderNumberAndpostalCode = async (req, res, next) => {
    const postalCode = req.body.conversation.custom.zipCode;
    const orderNumber = req.body.conversation.custom.orderNumber;
    var config = {
        method: 'get',
        url: 'https://www.potterybarn.com/customer-service/order-details/index.json?postalCode=92677&orderNumber=314082163101',
        headers: { 
          'Host': 'www.potterybarn.com', 
          'Accept': 'application/json, text/plain', 
          'Cookie': 'WSPFY=6bdb387d3809000064662761c1030000f7590000; _abck=C023543BE4D35747AB9CC189D4F82314~-1~YAAQa9s4fUvnM157AQAAYfrngQYgJ6Bpx7HgIRe7zFjTgfG7kSbh81hkXUUgje49VZe5YwYXcss/wFa7YB5OM+W9o/lwyoM8DQqW+xMRkauE/tW9fCw8A7kwwkCqxFw2twhhahWhIV9ScE3xNVCu7S4TIHcCE7viEU0UHI6DZnttU5Nw81p+NKRn01Z4I77Mj4E1YsKWBWwlBarIrHriqO9tYo5D0DmYp5969skeNQKVll3KcByAiFZhd/Jeq5XbgJwLAxV4qicL3VUZLcwvchz6NwEX/ad2zkuria1JKGAFSY4U26AEdDL8CIjcPMix58LLJK2XYYExzNsfCMVNJFUNTSjWTAX2n/CkzZXXG4AsByBfbaXQC5aWYKO0+Q==~-1~-1~-1; ak_bmsc=3E868AFC4EA9F3D07FBEA1D81EBADE45~000000000000000000000000000000~YAAQa9s4fXbpM157AQAA3qHogQyPlowDBbFTd6pdPOrUxvvNO3zCtxSuhGG6khiZRu9UrM0QmMLn4wY7WZrA3qfe3/xdiq+ZnP3+jbt/4dFj7wRS6nBZSNUAsAcgwnJt2ImLvmFWwwg5ueJhDxEnLg8kDvp5AGOeVvmP9s0u5PN9fsr1sHKXXaqx1u1Rbt8zL8zPdiwYk7vZGswdeV/cz6jhG5oEIGUEuRKUINcJmTUaAUYavaj25kmbwgBB1hbBeoKknOV9Na2XhaNYELBr2LPJdLVG+9yLuN8bWJXVUo1IFKf0JU4wiX0zFp30txtFi3lwhvkld/+5dzk4k21RDXD/3jCW90OD1th8c2it1FiiaDQaeSkbUTitbOf3d6tugdoMkjdJMkeyAzDI; bm_sv=AE93BBB2940A7924EF81A4015500C276~Xhq80H1211mq3WzjFRYpI/dVs4aieXlfbeUh18Krs7VRDulr9xuw3geYXz08MPh8t60uR6HKkj8TL2CSUi6GkQjQpY8V1HJ6noJbuoTWQu2s8IxQOAtco1s/96flRezJF/Hveb7Bfhnr6D2dxurBknNf8c/X+1aVMa1l0rMjccE=; bm_sz=57DE6AFFF170A886A4AC9B5F962C2020~YAAQa9s4fU3nM157AQAAYfrngQx83hS3W5rMj2Ug1CjwPRNWAsRnQhC54WDkVbE9tYxUV2x4v5OWkh57UcZEtu//3L/jHySSPFcPUUzMLv8eXGWXMMbh+DgAIeouNjzHrgEXpFc3f86JKMf8/caqxflDU6dy3tWFEduIixE7OaFZ7HwVSIc+teWLO/NKYRrPtfGweXAH8NC5E9LfdKP1EoMuhmuXRGoAauPHF1gNyDTrIWBnORo0QxzT92EivN4/wl0I0d7d27D4Q1bHRWcJunzKzXIWch0b0IkymI4soz30kW5k9rDRcw==~3424577~3617092; BIGipServerPool-PB-49446=!vybJf91MMDmtPVPf3yH5clkbmr6XcIT7w7mDQ8ucFAZrz1oJO/mdwqLURHD8wQ2QMok+fAz5EpaAyw==; INTERNATIONAL=US-USD-1; PB_PSID=ashburn.NEwyMyDOUbhIyLU_1dXVbu84o5-xdAsjHP6XcKCPbTbfJodhy3bYmx5dqnOmVfU-c1gty5k9tE19QIYMwqmY3ss9XiDEF11uyP1ID4e30RASCCzAMX5BH6Ju0quWKZEQFjlz31k%3D202108261001; WSGEO=PK|||24.87|67.05; WSIDC=EAST'
        }
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });


    // try {
    //     let response = await axios.get(`${constants.ORDER_DETAILS_API_URL}`, {
    //         params: {
    //             postalCode,
    //             orderNumber
    //         },
    //     });
    //     // let response = await axios.get(`${constants.ORDER_DETAILS_API_URL}`, {
    //     //     params: {
    //     //         postalCode,
    //     //         orderNumber
    //     //     },
    //     //     headers: {
    //     //         'Accept-Encoding': 'gzip, deflate, br',
    //     //         'Accept': '*/*',
    //     //         'Content-Type': 'application/json',
    //     //         'Content-Length' : 7
    //     //     },
    //     // });
    //     res.statusCode = 200;
    //     let responseObject = { actions: quiqResponseParser.createOrderDetailActions(response.data.orderDetailBean.orderData, postalCode, orderNumber), waitForCustomerResponseOverride: { shouldWait: false } }
    //     res.json(responseObject);
    // }
    // catch (e) {
    //     res.statusCode = 500;
    //     res.json({ error: "Something went wrong" });
    //     console.log(e);
    // }

};