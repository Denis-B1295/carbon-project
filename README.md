Before running the script please make sure, you have docker, latest node, nestjs/cli installed.

Also make sure you have .env files in frontend folder:
API_URL=http://localhost:3000
and backend: 
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=carbon-db

To run the project please do the following steps:
1. Build and run docker container to provide access to mongo with migrated data:
```
docker build -t mongo-csv-import .
docker run -it --name mongo-csv-import-container -p 27017:27017 -v mongo-data:/data/db mongo-csv-import
```
Double check the container is running, as an extra check make sure you can connect to mongo on mongodb://localhost:27017
and have database 'carbon-db' and collection 'projects'
2. cd into carbon-backend and run nestjs, it runs on 3000 port:
```
npm i && npm run start
```
3. cd into carbon-frontend and run nextjs, if you run nestjs, it should automatically run on another port than 3000(3001 most likely):
```
npm i &&  npm run dev
```

Unfortunatley I didn't finish the pages with generate and search functionality. But the frontend can show a list of projects from mongo.

Backend is finished - the core logic. To test generate and search please use postman or another tool:

- The request to test search is the following, for number values it takes ranges in the format of [number, number], except for id: 
```
curl --location 'http://localhost:3000/project/search?earliestDate=2014&offeredVolumeInTons=800&offeredVolumeInTons=1400' --data ''
```
If only one number provided for the range it is considered as min value.

- The request to test generate is the following:
curl --location 'http://localhost:3000/project/generate-portfolio' --header 'Content-Type: application/json' --data '{
    "desiredVolume": 19515
}'

Unit tests are done only for backend, generated with teh help of AI(to save time) and verified(adjusted by me).
Run from backend folder: 
```
npm run test
```