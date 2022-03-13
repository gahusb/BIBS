const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');

const posts = new Router();

// 인증이 필요한 API보호
posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);

// 글쓰기 기능은 없앰
posts.post('/page', postsCtrl.checkLogin, postsCtrl.write);
posts.post('/', postsCtrl.checkLogin);
posts.delete('/:id', postsCtrl.checkLogin, postsCtrl.checkObjectId, postsCtrl.remove);
/* posts.put 제거됨 */
posts.patch('/:id', postsCtrl.checkLogin, postsCtrl.checkObjectId, postsCtrl.update);

module.exports = posts;