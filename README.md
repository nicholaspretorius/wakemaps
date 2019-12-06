# Wakemaps

### Run the app - local machine

* `export FLASK_APP=project/__init__.py; export FLASK_ENV=development; python manage.py run`

### Run the app - Docker

* `docker-compose up --build`

### Run the tests

* `docker-compose exec users pytest "project/tests"`
* `docker-compose exec users pytest -p no:warnings "project/tests"`

### Working with the database

* `docker-compose exec users flask shell` - interact with app and db from shell
* `docker-compose exec users python manage.py recreate_db` - recreate the db
* `docker-compose exec users-db psql -U postgres` - connect to the db