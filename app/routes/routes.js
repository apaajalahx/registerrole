const route = require('express').Router();
const middleware = require('../middleware/auth.jwt');
const UsersController = require('../controller/users.controller');
const RoleController = require('../controller/roles.controller');
// login
route.post('/auth',UsersController.Auth);
// register user
route.post('/register',UsersController.Register);
// reset password
route.post('/reset_password', UsersController.ResetPassword);
// verify email
route.get('/verify/:verify',UsersController.VerifyEmail);
// logout
route.post('/logout', UsersController.Logout);
// refresh token
route.post('/token', UsersController.RefreshToken);

route.use(middleware.Auth);
// print your self
route.get('/', UsersController.Index);
// find user with id
route.get('/find/:id', UsersController.Find);
// update user with id, if you are admin
route.post('/update/:id',UsersController.Update);
// update your account
route.post('/update',UsersController.Update);
// delete user with id, if you are admin
route.delete('/delete/:id', UsersController.DeleteFind);

// add role.
route.post('/roles/create', RoleController.Create);
// update role.
route.post('/roles/update/:id', RoleController.Update);
// delete role.
route.delete('/roles/delete/:id', RoleController.Delete);

module.exports = route;