const Router = require('koa-router');

const auth = new Router();
const authCtrl = require('./auth.ctrl');

auth.post('/login', authCtrl.login);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

auth.post('/userlogin', authCtrl.userlogin);
auth.get('/checkUser', authCtrl.checkUser);
auth.post('/userlogout', authCtrl.userlogout);
auth.post('/userlogup', authCtrl.userlogup);

module.exports = auth;