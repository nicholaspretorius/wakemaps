import json

from project import db
from project.api.models import User

def test_add_user(test_app, test_database):
    client = test_app.test_client()
    res = client.post('/users', data=json.dumps({
        'username': 'nicholas',
        'email': 'nicholaspretorius@gmail.com'
    }), content_type='application/json')

    data = json.loads(res.data.decode())
    assert res.status_code == 201
    assert 'nicholaspretorius@gmail.com was added!' in data['message']
    assert 'success' in data['status']

def test_add_user_invalid_json(test_app, test_database):
    client = test_app.test_client()
    res = client.post('/users', data=json.dumps({}), content_type='application/json')

    data = json.loads(res.data.decode())
    assert res.status_code == 400
    assert 'invalid payload' in data['message']
    assert 'fail' in data['status']

def test_add_user_invalid_json_keys(test_app, test_database):
    client = test_app.test_client()
    res = client.post('/users', data=json.dumps({
        'email': 'test@test.com'
    }), content_type='application/json')

    data = json.loads(res.data.decode())
    assert res.status_code == 400
    assert 'invalid payload' in data['message']
    assert 'fail' in data['status']

def test_add_user_duplicate_email(test_app, test_database):
    client = test_app.test_client()
    client.post(
        '/users',
        data=json.dumps({
            'username': 'nicholas',
            'email': 'nicholaspretorius@gmail.com'
        }),
        content_type='application/json' 
    )
    resp = client.post(
        '/users',
        data=json.dumps({
            'username': 'nicholas',
            'email': 'nicholaspretorius@gmail.com'
        }),
        content_type='application/json',
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert 'Sorry. That email already exists.' in data['message']
    assert 'fail' in data['status']

def test_get_user(test_app, test_database):
    user = User(username="John", email="john@doe.com")
    db.session.add(user)
    db.session.commit()

    client = test_app.test_client()
    res = client.get(f'/users/{user.id}')
    data = json.loads(res.data.decode())
    assert res.status_code == 200
    assert 'John' in data['data']['username']
    assert 'john@doe.com' in data['data']['email']
    assert 'success' in data['status']

def test_single_user_no_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.get('/users/blah')
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert 'There is no user with that user_id' in data['message']
    assert 'fail' in data['status']


def test_single_user_incorrect_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.get('/users/999')
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert 'There is no user with that user_id' in data['message']
    assert 'fail' in data['status']