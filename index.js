const express = require('express');
const bodyParser = require('body-parser');
const check = require('check-types');
let router = express.Router();
let app = express();
app.use(router)


app.use(bodyParser.json())

app.post('/transaction', (req, res)=> {
    try {
        let reqDetails = {...req.body}
        if(!Number(reqDetails.senderBalance) || !Number(reqDetails.receiverBalance) || !Number(reqDetails.transactionAmount)) {
            throw 'Input is missing';
        }

        if(reqDetails.senderBalance >= reqDetails.transactionAmount) {
            reqDetails.senderBalance -= reqDetails.transactionAmount;
            reqDetails.receiverBalance += reqDetails.transactionAmount; 

            res.status(200).send({
                message: 'Transaction completed successfully',
                senderBalance: reqDetails.senderBalance,
                receiverBalance: reqDetails.receiverBalance
            });
        }
        else {
            res.status(200).send({
                message: 'Not enough fund. Please increase your account balance',
            });
        }
    }
    catch(err) {
        console.log(err);
        res.status(400).send({
            message: 'Error occurred. Please check values and try again later!'
        })
    }
})

module.exports = app.listen(3000, () => {
    console.log('server listening');
});