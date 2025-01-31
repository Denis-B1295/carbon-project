#!/bin/bash
mongod --bind_ip_all --fork --logpath /var/log/mongodb.log --logappend

until mongosh --eval "print(\"MongoDB is ready\")"; do
    echo "Waiting for MongoDB to start..."
    sleep 1
done

database=carbon-db
collection=projects

# Check if the collection already has data
count=$(mongosh --quiet --eval "db.getSiblingDB('$database')['$collection'].countDocuments()" | grep -oE '^[0-9]+$')

# Check if the count is a number and greater than 0
if [[ "$count" =~ ^[0-9]+$ ]] && (( count > 0 )); then
    echo "Collection '$collection' in database '$database' already contains data. Skipping import."
else
    echo "Importing data into '$collection' in '$database'..."
    mongoimport --host localhost --db $database --collection $collection --type csv --headerline --file projects_sample.csv
    if [[ $? -eq 0 ]]; then
        echo "Data imported successfully."
    else
        echo "Error during data import."
    fi
fi

tail -f /dev/null


# docker build -t mongo-csv-import .
# docker run -it --name mongo-csv-import-container -p 27017:27017 -v mongo-data:/data/db mongo-csv-import

# docker stop mongo-csv-import-container
# docker start mongo-csv-import-container

# The script checks if there is no data,