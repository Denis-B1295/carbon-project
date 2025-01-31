FROM mongo:latest

WORKDIR /usr/src/app

COPY data/projects_sample.csv .
COPY data/import.sh .

RUN apt-get update && apt-get install -y mongodb-org-tools

RUN chmod +x import.sh

# Run the import script
CMD ["./import.sh"]