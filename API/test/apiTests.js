let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
let expect = chai.expect;
// let should = chai.should();

chai.use(chaiHttp);
const agent = chai.request(server).keepOpen(() => { done() });
describe('Users Endpoint', () => {
    before((done) => {
        setTimeout(() => {
            done();
        }, 4000);
    })
    describe('/POST', () => {
        it('should POST a new test user', async () => {
            let res = await agent
            .post('/api/users/register')
            .send({username: 'Chai Test User', email: 'chai@test.com', password: 'chaitestpassword'});
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('username').with.equal('Chai Test User');
        });

        it('should POST an error due to username already being in use', async () => {
            const res = await agent
            .post('/api/users/register')
            .send({username: 'Chai Test User', email: 'chai1@test.com', password: 'chaitestpassword'});
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            let msg = res.body.validationResult[0].msg;
            expect(msg).to.equal("Username already in use!");
        });
    });
});