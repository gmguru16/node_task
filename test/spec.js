const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Testing', ()=> {
    it('transactionAmount exceeds the senderBalance, it return insufficient fund error', (done)=> {
        let reqDetails = {
            "senderBalance": 1000,
            "receiverBalance": 500,
            "transactionAmount": 10000
        }
        chai.request(server)
        .post("/transaction").send(reqDetails)
        .end((err, resp) => {
            const { body } = resp;
            expect(resp.status).to.equal(200);
            expect(body.message).to.equal('Not enough fund. Please increase your account balance');
        done();
        })
    });

    it('transactionAmount less than the senderBalance, it return success message', async()=> {
        let reqDetails = {
            "senderBalance": 1000,
            "receiverBalance": 500,
            "transactionAmount": 100
        }
        chai.request(server)
        .post("/transaction").send(reqDetails)
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
        chai.request(server)
        .post("/transaction").send(reqDetails)
        .then(resp => {
            const { body } = resp;
            expect(resp.status).to.equal(400);
            expect(body.message).to.equal('Error occurred. Please check values and try again later!');
        })
    });
})