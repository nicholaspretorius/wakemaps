# Wakemaps

### Run the app - local machine

* `export FLASK_APP=project/__init__.py; export FLASK_ENV=development; python manage.py run`

### Run the app - Docker

* `docker-compose up --build`

### Run the tests

* `docker-compose exec users pytest "project/tests"`