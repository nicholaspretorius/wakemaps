import pytest

import project

@pytest.fixture(scope='module')
def test_app():
    app = project.app
    app.config.from_object('project.config.TestingConfig')
    with app.app_context():
        yield app # testing here

@pytest.fixture(scope='module')
def test_database():
    db = project.db
    db.create_all()
    yield db # testing here
    db.session.remove()
    db.drop_all()