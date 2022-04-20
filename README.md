# Group-Management-System

## Prerequisite 
- Install PostgreSQL: [PostgresSQL Download Page][4]
- Install Node js: [Node JS Download Page][1] 
- Install Yarn: [Yarn Install Page][2]

## Development
- Clone project: https://github.com/Anthony8044/Group-Management-System.git
- 1.) Create and Load Database
  - 1.1) Open terminal in root /Group-Managemnet-System folder and start postgres service with: sudo service postgresql start
  - 1.2) Open posgreSQL terminal with: sudo -u postgres psql
  - 1.3) Create the database with command: CREATE DATABASE gms;
  - 1.4) Quit postgres terminal: \q
  - 1.5) Load database with: psql -h localhost -U postgres gms < "Location of gms_database.sql" eg. psql -h localhost -U postgres gms < gms_database.sql
    -  Use default password: 123123
- 2.) Start Server
  - 2.1) Open terminal in root /Group-Managemnet-System folder: cd /server2
  - 2.2) install node modules: npm install
  - 2.3) Start server: npm start
- 3.) Start Client
  - 3.1) Open terminal in root /Group-Managemnet-System folder: cd /client
  - 3.2) Install node modules: yarn install
  - 3.3) Start client: yarn start
  - 3.4) Browser should open on [localhost:3000][3]





[1]: https://nodejs.org/en/download/
[2]: https://classic.yarnpkg.com/lang/en/docs/install/
[3]: http://localhost:3000/
[4]: https://www.postgresql.org/download/
