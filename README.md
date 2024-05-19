# shop-tracker-express-api
This module contain api logic for shop tracker

### Getting Started

You need to set up your development environment before you can do anything.

Install Nodejs and npm

Install dependencies

Create .env file from the .env.example file and update the values as per your environment configuration.

### Migration

To create the migration file run the following command:

```
npx tsc --showConfig > tsconfig.tsnode.json
npx tsx ./node_modules/.bin/knex migrate:make --knexfile knexfile.ts <migration-file-name> -x ts
```

To run the migration run the following command:

```
npx tsx ./node_modules/.bin/knex migrate:latest
```

To rollback the migration run the following command:

```
npx ts-node --project tsconfig.tsnode.json ./node_modules/.bin/knex migrate:rollback
```