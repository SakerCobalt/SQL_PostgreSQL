//Add a "migrate": "node-pg-migrate" to the scripts of package.json 
//Create new migration file from terminal
// npm run migrate create table comments   //table comments is the name of the migration

//Need to set up environment variable so the migration file can update postgres soialnetwork DB
// DATABASE_URL
//postgres://USERNAME:PASSWORD@localhost:5432/socialnetwork

//Windows CMD $set DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/socialnetwork&&npm run migrate up

//This does not work will with passwords which have special characters in them i.e. $

//Linux terminal $DATABASE_URL=postgres://westongray:password@localhost:5432/socialnetwork npm run migrate down
//Down only reverts one step at a time.