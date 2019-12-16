# Wakemaps

[![pipeline status](https://gitlab.com/nicholaspretorius/wakemaps-test/badges/master/pipeline.svg)](https://gitlab.com/nicholaspretorius/wakemaps-test/commits/master)

### Run the app - local machine

* `export FLASK_APP=project/__init__.py; export FLASK_ENV=development; python manage.py run`

### Run the app - Docker

* `docker-compose up --build`
* `export REACT_APP_USERS_SERVICE_URL=http://localhost:5001`
* `docker-compose logs -f`

### Run the tests

* `docker-compose exec users pytest "project/tests"`
* `docker-compose exec users pytest -p no:warnings "project/tests"`
* `docker-compose exec users pytest "project/tests" -p no:warnings --cov="project"`
* `docker-compose exec users pytest "project/tests" -p no:warnings --cov="project" --cov-report html`
* `open htmlcov/index.html`

### Run the client tests

* `docker-compose exec client npm test`
* `docker-compose exec client react-scripts test --coverage`
* `docker-compose exec client npm run lint`
* `docker-compose exec client npm run prettier:check`
* `docker-compose exec client npm run lint`

### Working with the database

* `docker-compose exec users python manage.py recreate_db` - recreate the db
* `docker-compose exec users python manage.py seed_db` - seed the db
* `docker-compose exec users-db psql -U postgres` - connect to the db
* `docker-compose exec users flask shell` - interact with app and db from shell

### Linting, Formatting, Import Ordering

* `docker-compose exec users flake8 project`
* `docker-compose exec users black project --check`
* `docker-compose exec users /bin/bash -c "isort project/*/*.py --check-only"`

Make changes? 

* `docker-compose exec users black project`
* `docker-compose exec users /bin/bash -c "isort project/*/*.py"`

Remove <none> Docker images: 

* `docker rmi $(docker images -f "dangling=true" -q)`


### Prod

* `export REACT_APP_USERS_SERVICE_URL=http://localhost:8007`
* `docker build -f Dockerfile.deploy -t registry.heroku.com/wakemaps-test/web .`
* `docker run --name wakemaps-test -e PORT=8765 -e DATABASE_URL="$(echo $DATABASE_URL)" -p 8007:8765 registry.heroku.com/wakemaps-test/web:latest`