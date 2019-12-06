import json

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

def test_add_user_invalid_kson_keys(test_app, test_database):
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
 