const { describe, it } = require('mocha');
const { use, expect } = require('chai');
const request = require('supertest');

describe('Testing', ()=> {
    it('transactionAmount exceeds the senderBalance, it return insufficient fund error', async()=> {
        let reqDetails = {
            "senderBalance": 1000,
            "receiverBalance": 500,
            "transactionAmount": 10000
        }
        await request()
        .post("/transaction").body(reqDetails)
        .then(resp => {
            const { body } = resp;
            expect(resp.status).to.equal(200);
            expect(body.message).to.equal('Not enough fund. Please increase your account balance');
        })
    });

    it('transactionAmount less than the senderBalance, it return success message', async()=> {
        let reqDetails = {
            "senderBalance": 1000,
            "receiverBalance": 500,
            "transactionAmount": 100
        }
        await request()
        .post("/transaction").body(reqDetails)
        .then(resp => {
            const { body } = resp;
            expect(resp.status).to.equal(200);
            expect(body.senderBalance).to.equal(reqDetails.senderBalance - reqDetails.transactionAmount);
            expect(body.receiverBalance).to.equal(reqDetails.receiverBalance + reqDetails.transactionAmount);
            expect(body.message).to.equal('Transaction completed successfully');
        })
    });

    it('input data is not matching, it return error', async()=> {
        let reqDetails = {
            "senderBal": 1000,
            "receiverBal": 500,
            "transactionAmnt": 100
        }
        await request()
        .post("/transaction").body(reqDetails)
        .then(resp => {
            const { body } = resp;
            expect(resp.status).to.equal(400);
            expect(body.message).to.equal('Error occurred. Please check values and try again later!');
        })
    });
})