import json

from project.tests.utils import add_user, recreate_db


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


def test_single_user(test_app, test_database):
    user = add_user("John", "john@doe.com")
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


def test_all_users(test_app, test_database):
    recreate_db()
    add_user('jane', 'jane@doe.com')
    add_user('jack', 'jack@jill.com')
    client = test_app.test_client()
    resp = client.get('/users')
    data = json.loads(resp.data.decode())
    assert resp.status_code == 200
    assert len(data['data']['users']) == 2
    assert 'jane' in data['data']['users'][0]['username']
    assert 'jane@doe.com' in data['data']['users'][0]['email']
    assert 'jack' in data['data']['users'][1]['username']
    assert 'jack@jill.com' in data['data']['users'][1]['email']
    assert 'success' in data['status']
