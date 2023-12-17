# astro collective

astro collective catalogues astronauts, missions, and spacecraft, allowing users to search for and create new records in the database. Astro collective uses the NASA Astronomy Photo of the Day API and the Number of People in Space open API. 

## Set Up Instructions
To set up this project locally, first clone the repository onto your machine.

Once you have the repository downloaded, open MySQL locally and run the following commands:
```
source create-db.sql
```
```
source insert-testdata.sql
```
```
source views.sql
```
Now your SQL database should be set up, to check this, run the following query:
```
SHOW TABLES;
```
If the MySQL database has been correctly created, this should look like this:
<img width="400" alt="Screenshot 2023-12-17 at 04 49 51" src="https://github.com/keeley1/astro-collective/assets/116581328/1180df9e-755d-49cc-b6b0-820dfd5bb3f2">

## Run Project
Finally, to run the project, run the following command in the terminal:
```
node index.js
```
Now the project is running, go to [localhost:8000](http://localhost:8000/)

If the project has been set up correctly, this should look like: 
<img width="1424" alt="Screenshot 2023-12-17 at 02 18 53" src="https://github.com/keeley1/astro-collective/assets/116581328/252770bf-5380-4e58-bfca-7b5fbd97c32c">


