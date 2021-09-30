const constants = require('../constants/constants');
const axios = require('axios');
const quiqResponseParser = require('../utils/quiq-response-parser')

exports.getOrderDetailByOrderNumberAndpostalCode = async (req, res, next) => {
    console.log(req);
     if(!req.body.conversation){
        res.statusCode = 400;
        res.json({error: "req.body.conversation undefined"});
        return;    
    }
    const context = req.body.conversation.webData && req.body.conversation.webData.context;
    const postalCode = req.body.conversation.custom && req.body.conversation.custom.zipCode;
    const orderNumber = req.body.conversation.custom && req.body.conversation.custom.orderNumber;
    const contactPointId = req.body.conversation.contactPointId;
    const pageNumber = 1;
    res.statusCode = 200;
    try {
        let response;
        if (context && context.intent === 'isLoggedIn') {
            const url = `${constants.BRAND_HOSTNAMES[contactPointId]}${constants.ORDER_URLS.USER_ORDERS_API_URL}`;
            response = await getUserOrdersByCookie(context.data.cookie);
            if (response.data.orderHistoryBean.data) {
                let responseObject = { actions: quiqResponseParser.createOrderHistoryActions(response.data.orderDetailBean.data, contactPointId), waitForCustomerResponseOverride: { shouldWait: false } }
                res.json(responseObject);
            } else {
                let responseObject = { actions: quiqResponseParser.createOrderHistoryNotFoundActions(), waitForCustomerResponseOverride: { shouldWait: false } }
                res.json(responseObject);
            }
            console.log(response);
        }
        else {
            response = await axios.get(`${constants.BRAND_HOSTNAMES[contactPointId]}${constants.ORDER_URLS.ORDER_DETAILS_API_URL}`, {
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
    }
    catch (e) {
        res.statusCode = 500;
        res.json(e);
        console.log(e);
    }

};



const getUserOrdersByCookie = (cookie) => {
    var config = {
        method: 'get',
        "mode": "cors",
        "referrer": "https://www.williams-sonoma.com/customer-service/order-shipment-tracking/?cm_type=gnav",
        "referrerPolicy": "strict-origin-when-cross-origin",
        url: 'https://www.williams-sonoma.com/account/orderhistory/index.json?pageNumber=1',
        headers: {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie" : cookie,
            // "cookie": "WSPFY=2e1d2017bd71000078e930612e0300006a030600; crl8.fpcuid=12cf4131-9967-456e-a828-239dd7783926; _gcl_au=1.1.1863952577.1630595457; _ga=GA1.2.1199624823.1630595457; _fbp=fb.1.1630595456970.1141393632; _scid=c290d757-e502-4a1e-86b5-438855b483a7; QuantumMetricUserID=ad5543d13aa4af734479bd5acf74da24; s_ecid=MCMID%7C71646812977509644293304057268540410518; svi_dec=71646812977509644293304057268540410518; fpcid=4600835373394449966_FP; _svsid=8378af57e9322b9044a2f2ec60c50c3b; WSAB=15b76f48-e267-41b2-8386-731c8dd16efe; _pin_unauth=dWlkPU9ERm1ZVEU0T0RZdE1qRmhNUzAwTkdWbExXSmpNVEF0TUdNM09HVmhNekV5TnpFdw; WSMX_PERSIST_COOKIE=A615cde0ea5-58a5-41c7-8ebe-13999fa3e72e5cde0e; e43C2=lvngvaDrm9sDyGuQnDxUWzoz%2Bkw%3D; WSACCOUNT=5cde0ea5-58a5-41c7-8ebe-13999fa3e72e; INTERNATIONAL=US-USD-1; check=true; TnTNew=true; AMCVS_D38758195432E1050A4C98A2%40AdobeOrg=1; isLoginSuccessAnalyticsEventLogged=1; CreState=H1pi52aetTUYNvqDvEjRvw8zjIf8Dq2BREAP65WUdUOLhYPSSrGY0PJEMg%2BR3FXn.c23.v1; s_cc=true; IR_gbd=williams-sonoma.com; kenshoo_id_match=e651398b-c68e-fbf0-f0f3-5ddbdea05d80; WSMX_REG_LIST_STS=0; WSIDC=EAST; WSGEO=PK|||24.87|67.05; bm_sz=F0FD04C7336734E5124999B649BDADCE~YAAQFp4QAindrVp7AQAA5cor9A0DhGql9GrRNRq4t46zTrYXqV7riiTYgSgs8hwk2xS0jPlYevEs0EEAvRafZkGAWVMUyRZDYl9wwplhDLiKut3LX+gDPtHVI8tmetf1lxobjK8chtRp7Fjwx43j+DoelQFfkvHB1brwio6OqWwKKf3RPDd3LZ6pctOleraKx0LokuBAiZrymJXBKmoWNXSSGykIx3MyUSXWjOFuLySDCXrFw0UY4CnalvWGpvvmDDEJS3gjyxOPlQSueZ4Eztl+gD+HrFw28ytfWCr8vSTUAuq/YzWxUe79K9k=~4405556~3425841; _abck=A6EF4C5CF4A3538F7DC83239FBB5B257~0~YAAQFp4QAifdrVp7AQAA5cor9AZ4mIbr6qH1+xztwmOb09JB1BbKAmkTykNWFwgQlVrCJHAgbNvgzhLrxh8Y2LOfRY5JCLLlHH7r2Om/+cPAa+3bfII6jBAQBcBb6fYb4+zHZj/murlRLLcxEKozHqSi13y/Jr70tKvLPP5COsbMtlbGhmfXx+tC70y+WSpSBS5p/+PB/EqR+Qx6IjyNVJUTYiKpWKq7ehs5Lca29FbBCI1QALQ7dssJ3YFw92aNdG0+fgxbWVXc7/TYaiWmASgEAT63KDPEtGT57mFxeIPTmXZ89GgUgUL5xNfnGy/d2O+97SNXhfPL0lFlt3Pq4LkGC3dO1xt1r+dqUv6uL+MsfZKBhQ02x82s6Fthe53c1wVXqKPhrultIsE3k6pe2Y8Dw+UpcT3wf+Msa0jgmmy3~-1~-1~-1; ak_bmsc=8EA1333A8E2A4E5E0A191CAE14CCEC2C~000000000000000000000000000000~YAAQFp4QAgHerVp7AQAAvtgr9A0f8IlMbP3TXLgp9tisKtMDABBzeDFiK/YhFwuYd/j4sqmV7TMjM1B4gwVNlJPGFj5HJsjPOmwEPvhKfu9hvShbiQYTQKvTTVDMXp4CCSNkoFnyg+1FYGLFTSHGiJRsntTyrCoWgxvCWJKB/BL0MikdvCnC37iuET43nEZ0WDZVRTILDKZExFow7C1RBM262vkuZRUF5XYUgEmfmJeaX95izqB8gmvftB1P1dpmLkqMKLIiwqPl7n09bNP6bNF2Cy2ie/a8+aSaXWkhBaaJ/PgFQJOt6bAz2t9FNc3AOB0HH4aP8EMwKmETSdo36o6vANsCrqosXouf9GFHbWc66B1uAHWc74ZPhMTZHTt9vVJYmvNu3ySe6FqrWdPHZRhukQEOZisNCYaie16338NTE2WyHPPODIEHJ/oSqtW5PDeIuiK8wLDCa5bpKGVcA5eO7i65waPAcUOK1/gM07XgdXoTPzzxtNA+mz30pJjyUdN4hCU=; productnum=9; doubleclick_24h=true; _gid=GA1.2.960942290.1631889125; QuantumMetricSessionID=285367ff188b2ad94e4101007587f36b; kenshoo_tapad_id_sync=befff0ea-dd3c-1d55-83c8-048162fb1eec; WS_PSID=ashburn.2UBe-Bh0G32ercV1_qkP5AgVR4Y5v_oTT6dQyKh8OnAjCOF019Bf9p4Qta7Tbty0DicR9JWzSrdBurpdRQjQbhC71vFUzXuHX1pZUdcicsGVLEaaSIMkdVuyHfRpOxJJOlpPT9w%3D202109171432; ad_sess_ws_email=true; WS_PLID=AwEQU9HasdEeils76lKaRTQkiNK0LJF5o7O_XpM8APaDtK8viR_SaLd5xI9Zv2DA-jolVFRR4XfF911hdagqEJHGn0Ok45Hqiie4ceuN3EF6ISNo5fl6xHdavHVqZvvm6TAzXBK8Ug68N3phVmN37rNZAnpZWKXe4gSbSJQR1gPAAtSC9v6DM2yiW8xF-wqXejQ4cstf7jHvYjWLcOcVKfPQxdwCi5LrIS62jvdB6KOZmuFkdXjJMY6L8gXtpDDGFIzsRPRi79KrnYYi8jB9gwdahqaqeeoR7L-oy2t40eEX_dUUb5NpcKxWvdjbdzh87F7MWHsGlMTMb3MHiSDnZmuBVQNXtt8wP0OhQgSPnI7pUVDKD4fnmWCWqTRNiK8gKNR2e2g1_etZN-ws; UI_USERNAME_COOKIE=v2|Shariq+Shahzad|5cde0ea5-58a5-41c7-8ebe-13999fa3e72e|PL_1; AMCV_D38758195432E1050A4C98A2%40AdobeOrg=1075005958%7CMCIDTS%7C18888%7CMCMID%7C71646812977509644293304057268540410518%7CMCAAMLH-1632494015%7C3%7CMCAAMB-1632494015%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1631896415s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.1%7CMCCIDH%7C1848995076; rr_rcs=eF4FwbERgCAQBMCEyF7O4Q94jw6sAx9nDMzU-t1Ny_09V6wkYV5M6jS14mAGLL3HPjxmPxXgkKOWbSLLAr61KdGDtf9qnxFD; bm_sv=9787E9D5202E45112E0214655B3BF063~XO3DGmSxTTFHJgXGDRkNfGdTwg0FkUWySz1fLXe5Bv08jTi3Pa9oYpWKfzHB7CTfFdhW6YGMfazwe75ZA+rWcB5JfLZtcIhPg3wa8+XhSHT8pPKM+kxEMWPkzVuqXaXdfyoWoWdJz46k9ADRG/bWqioOerDDgWET77laDd9z5Dw=; IR_4291=1631889223564%7C0%7C1631889223564%7C%7C; IR_PI=fbbfc868-d06b-11eb-8770-061ec55953b4%7C1631975623564; s_lv=1631889223653; s_nr44=1631889223657-Repeat; s_tp=1377; s_ppv=customer-service%253Aorder-shipment-tracking%2C63%2C63%2C864; s_sq=wsiwsdev%3D%2526c.%2526a.%2526activitymap.%2526page%253Dcustomer-service%25253Aorder-shipment-tracking%25253Aresults%2526link%253DHide%252520chat%2526region%253DquiqWebChat%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253Dcustomer-service%25253Aorder-shipment-tracking%25253Aresults%2526pidt%253D1%2526oid%253DfunctionTn%252528%252529%25257B%25257D%2526oidt%253D2%2526ot%253DSUBMIT; utag_main=v_id:017ba7101a8800199d310f00499d03079002d07100ac8$_sn:17$_ss:0$_st:1631891024278$vapi_domain:williams-sonoma.com$_pn:4%3Bexp-session$ses_id:1631889122546%3Bexp-session$_prevpage:customer-service%3Aorder-shipment-tracking%3Bexp-1631892823508$prev_page_primary_category:customer-service%3Bexp-session; _br_uid_2=uid%3D8467626084635%3Av%3D12.0%3Ats%3D1630595456707%3Ahc%3D36; _uetsid=06d823c017c411eca8ada74660944b86; _uetvid=fbcce7a0d06b11ebaafbed685a4d8a4a; ak_wfSession=1631891981~id=aS/XY7BxB+o4XQhAk7ZydGrmIa3bKWcS96Xlc5nplcM=; BIGipServerPool-WSDP-49446=!yW9cPP/yaHfVDNzf3yH5clkbmr6XcFxtjbWWTsuhY2Yf6Dm8AkP9jZ0foCROYXXXmQS6UoV6Ng1i2g==; ADRUM_BT1=\"R:32|i:59241\"; SameSite=None; ADRUM_BTa=\"R:32|g:63b3e6ab-5819-4b53-845e-a95b8125aba5|n:customer1_dfb47642-9886-4f68-b572-ccd70e682bb3\"; RT=\"z=1&dm=williams-sonoma.com&si=dab0596e-785c-41fa-ab16-0da454b07da4&ss=ktogn774&sl=3&se=2s0&tt=8hl&bcn=%2F%2F684fc53b.akstat.io%2F&ul=1ckd0&hd=1clom\"; mbox=PC#bf41a18ea7ba4089838681f9803e9cc7.38_0#1695134023|session#042b9965277946c28ea75780618e2cf9#1631893243"
        }
    };
    return axios(config)
}
