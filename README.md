just register and auth with role access.

# Install with sequelize cli
## INSTALL 

```bash
npx sequelize db:migrate
npx sequelize db:seed:all
```

## RUN 
```bash
npm run start
```
## DEV (NODEMON)
```bash
npm run dev
```

## API DOCUMENT.... 
Default Login<br>
email : admin@example.com<br>
password : admin123<br>

__API Version__ : v1<br>
__API Path__ : /api/v1/:Endpoint

| Method | Endpoint | Params | Body | Headers | Description |
| -------- | ------ | ------ | ------ | ------ | -----------|
| post | /auth | - | email & password | - | login |
| post | /register | - | name, email, phone, password | - | Register new account |
| post | /reset_password | - | email | - | reset password account |
| get | /token | - | refreshtoken | - | create new accesstoken (X-ACCESS-TOKEN) using refreshtoken |
| get | /logout | - | refreshtoken | - | logout and destroy refreshtoken |
| get | / | - | - | x-access-token | using accesstoken from login expiresIn(20min) |
| post | /find/:id | id | - | x-access-token | find users by id |
| post | /update/:id | id |  type: info (name,email,phone)/password (password) | x-access-token | update account by id (admin required) |
| post | /update | - |  type: info (name,email,phone)/password (password) | x-access-token | update/edit your account |
| post | /delete/:id | id | - | x-access-token | delete account by id (admin required)

<br>
next time will update...

