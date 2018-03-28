console.log(process.env.TESTMONGO_URI);

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server/server-index.js');
chai.use(chaiHttp);

describe('Server',  () => {
  describe('Basic Routes', () => {
    it('responds to /', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
        done();
      });
    })
  })
  describe('Challenge Routes', () => {
    describe('/GET initialChallenges', () => {
      it('SC 200 & it should GET all(5) initial challenges', (done) => {
        chai.request(server)
          .get('/initialChallenges')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(5);
          done();
        });
      });
    })
    describe('/GET courseChallenges', () => {
      it('SC 200 & it should GET all(6) course challenges', (done) => {
        chai.request(server)
          .get('/courseChallenges')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(6);
          done();
        })
      })
    })
    describe('/POST challengeSolution', () => {
      it('should require login', (done) => {
        chai.request(server)
          .post('/challengeSolution')
          .send('FILL_ME_IN')
          .end((err, res) => {
            res.should.have.status(200);
          done();
          })
      })
      it('should receive submission object', (done) => {
        chai.request(server)
          .post('/challengeSolution')
          .send('FILL_ME_IN')
          .end((err, res) => {
            res.should.have.status(200);
          done();
          })
      })
      it('should return submission response', (done) => {
        chai.request(server)
          .post('/challengeSolution')
          .send('FILL_ME_IN')
          .end((err, res) => {
            res.should.have.status(200);
          done();
          })
      })
    })
  })

  //add logout aftereach for success auth routes
  describe('Auth Routes', () => {
    let testUser = {username: "testmocha@gmail.com", password: "testpw", nickname: "testmocha"};
    let testUser2 = {username: "testmocha2@gmail.com", password: "testpw", nickname: "testmocha2"};
    let emailTaken = {message: ["Email already taken"]};
    let wrongPassword = {message: ["Incorrect password"]};
    //signup tests
    describe('/POST signup', () => {
      it('SC 201 & it should receive user object from front end', (done) => {
        chai.request(server)
          .post('/signup')
          .send(testUser)
          .end((err, res) =>{
            res.should.have.status(201);
            testUser.should.be.a('object');
            testUser.should.have.property('username');
            testUser.should.have.property('password');
            testUser.should.have.property('nickname');
          done();
          })
      })
      it('it should return array(array[0] = newUser object) on success', (done) => {
        chai.request(server)
          .post('/signup')
          .send(testUser2)
          .end((err, res) =>{
            res.should.have.status(201);
            res.body.should.be.a('array');
            res.body[0].should.have.property('local');
            res.body[0].local.should.have.property('email');
            res.body[0].should.have.property('completedInitial').eql(false);
            res.body[0].should.have.property('username');
            res.body[0].should.have.property('local');
          done();
          })
      })
      it('SC 422 & it should return email taken message obj on failure', (done) => {
        chai.request(server)
          .post('/signup')
          .send(testUser)
          .end((err, res) =>{
            res.should.have.status(422);
            res.body.shoud.be.a('object');
            res.body.should.have.property('message').eql("Email already taken");
          done();
          })
      })
    })
    //login tests
    describe('/POST login', () => {
      it('SC 200 & it should receive user object from front end', (done) => {
        chai.request(server)
          .post('/login')
          .send(testUser)
          .end((err, res) =>{
            res.should.have.status(200);
            testUser.should.be.a('object');
            testUser.should.have.property('username');
            testUser.should.have.property('password');
          done();
          })
      })
      it('it should return it should return array(array[0] = newUser object) on success', (done) => {
        chai.request(server)
          .post('/login')
          .send(testUser)
          .end((err, res) =>{
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].should.have.property('local');
            res.body[0].local.should.have.property('email');
            res.body[0].should.have.property('completedInitial').eql(false);
            res.body[0].should.have.property('username');
            res.body[0].should.have.property('local');
          done();
          })
      })
      it('SC 401 & it should return info message on nonexistant user', (done) => {
        chai.request(server)
          .post('/login')
          .send({username: "idontexist", password: "none"})
          .end((err, res) =>{
            res.should.have.status(401);
            res.body.shoud.be.a('object');
            res.body.should.have.property('message').eql("User not found");
          done();
          })
      })
      it('SC 401 & it should return info message on incorrect password', (done) => {
        chai.request(server)
          .post('/login')
          .send({username: "testmocha@gmail.com", password: "wrongpw"})
          .end((err, res) =>{
            res.should.have.status(401);
            res.body.shoud.be.a('object');
            res.body.should.have.property('message').eql("Incorrect Password");
          done();
          })
      })
    })
    //logout tests
    describe('/GET logout', () => {
      it('SC 200 & it should return XXXXX on success', (done) => {
        chai.request(server)
          .get('/logout')
          .end((err, res) =>{
            res.should.have.status(200);
            server.req.user.should.eql('undefined'); // ?????
          done();
          })
      })
    })
  });
});
/*
questions for robin

test env best practice
  travisCI -> cloudDB? mlab?
  close server after?
  set different port for server?
  
  front end -> backend communication via testing? (login example)
  jest -> mocha -> jest
*/