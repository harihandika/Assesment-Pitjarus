### User Guide

1. Install NodeJS. (prepare node JS 14.17.*, You can read the installation guide in https://nodejs.org/en/download)
2. Open new terminal.
3. Type '$ npm install' or '$ npm i' to install module then press Enter.
4. After installation finished, type '$ nodemon' to run the code. (must be run code guide to run third step)

### Code Guide
*incase you can't run the code with 'connect ECONNREFUSED 127.0.0.1:3306' error, follow below instruction:*

1. Install / Open XAMPP, then click Start on Apache and MySQL module.
2. Make sure both Port(s) is appeared, then click MySQL's Admin button.
3. You'll be redirected to 'http://localhost/phpmyadmin/'. (this link for import database)
4. Click 'New' on top of left panel to create new database.
5. On database name column, input 'dev_test' and click Create.
6. After that, click on new database then click on Import tab.
7. If you wanna create database in terminal then use "npx sequelize db:create".
8. Choose file 'dev_test114.sql' in this folder, scroll down and click Import.
9. All setting is done. Go back to the code, and repeat the third step of User Guide.