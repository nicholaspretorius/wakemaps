import json

from flask import current_app

from project.tests.utils import add_user

# import time



def test_user_registration(test_app, test_database):
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps(
            {
                "username": "tester",
                "email": "testemail@test.com",
                "password": "greaterthaneight",
            }
        ),
        content_type="application/json",
    )

    data = json.loads(res.data.decode())
    assert res.content_type == "application/json"
    assert res.status_code == 201
    assert "Successfully registered." in data["message"]
    assert "success" in data["status"]
    assert data["auth_token"]


def test_user_registration_duplicate_email(test_app):
    add_user("testguy", "test@tester.com", "greaterthaneight")
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps(
            {
                "username": "tester",
                "email": "test@test.com",
                "password": "greaterthaneight",
            }
        ),
        content_type="application/json",
    )

    data = json.loads(res.data.decode())
    assert res.content_type == "application/json"
    assert res.status_code == 400
    assert "Sorry, that user already exists." in data["message"]
    assert "fail" in data["status"]


def test_user_registration_duplicate_username(test_app):
    add_user("tester", "test@testy.com", "greaterthaneight")
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps(
            {
                "username": "tester",
                "email": "testemail@test.com",
                "password": "greaterthaneight",
            }
        ),
        content_type="application/json",
    )

    data = json.loads(res.data.decode())
    assert res.content_type == "application/json"
    assert res.status_code == 400
    assert "Sorry, that user already exists." in data["message"]
    assert "fail" in data["status"]


def test_user_registration_invalid_json(test_app):
    client = test_app.test_client()
    res = client.post(
        "/auth/register", data=json.dumps({}), content_type="application/json"
    )

    data = json.loads(res.data.decode())
    assert res.content_type == "application/json"
    assert res.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


def test_user_registration_invalid_json_no_email(test_app):
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps({"username": "tester", "password": "greaterthaneight"}),
        content_type="application/json",
    )

    data = json.loads(res.data.decode())
    assert res.content_type == "application/json"
    assert res.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


def test_user_registration_invalid_json_no_username(test_app):
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps({"email": "tester@tester.com", "password": "greaterthaneight"}),
        content_type="application/json",
    )

    data = json.loads(res.data.decode())
    assert res.content_type == "application/json"
    assert res.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


def test_user_registration_invalid_json_no_password(test_app, test_database):
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps({"username": "tester", "email": "tester@tester.com"}),
        content_type="application/json",
    )

    data = json.loads(res.data.decode())
    assert res.content_type == "application/json"
    assert res.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


# /auth/login
def test_registered_user_login(test_app):
    add_user("John", "john@doe.com", "test")
    client = test_app.test_client()
    res = client.post(
        "/auth/login",
        data=json.dumps({"email": "john@doe.com", "password": "test"}),
        content_type="application/json",
    )

    data = json.loads(res.data.decode())
    assert res.status_code == 200
    assert res.content_type == "application/json"
    assert "success" in data["status"]
    assert data["auth_token"]
    assert "Login successful" in data["message"]


def test_unregistered_user_login(test_app, test_database):
    client = test_app.test_client()
    res = client.post(
        "/auth/login",
        data=json.dumps({"email": "tester@testerco.com", "password": "test"}),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())
    assert res.status_code == 401
    assert res.content_type == "application/json"
    assert "fail" in data["status"]
    assert "Email or password is incorrect" in data["message"]


def test_login_invalid_json(test_app, test_database):
    client = test_app.test_client()
    res = client.post(
        "/auth/login", data=json.dumps({}), content_type="application/json"
    )
    data = json.loads(res.data.decode())
    assert res.status_code == 400
    assert res.content_type == "application/json"
    assert "fail" in data["status"]
    assert "Invalid payload." in data["message"]


# /auth/logout
def test_valid_logout(test_app):
    add_user("testx", "testx@test.com", "test")
    client = test_app.test_client()
    res_login = client.post(
        "/auth/login",
        data=json.dumps({"email": "testx@test.com", "password": "test"}),
        content_type="application/json",
    )

    token = json.loads(res_login.data.decode())["auth_token"]
    res = client.get(
        "/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
        content_type="application/json",
    )
    data = json.loads(res.data.decode())
    assert res.status_code == 200
    assert res.content_type == "application/json"
    assert "Successfully logged out." in data["message"]
    assert "success" in data["status"]


def test_invalid_logout_expired_token(test_app):
    add_user("testy", "testy@test.com", "test")
    current_app.config["TOKEN_EXPIRATION_SECONDS"] = -1
    client = test_app.test_client()

    res_login = client.post(
        "/auth/login",
        data=json.dumps({"email": "testy@test.com", "password": "test"}),
        content_type="application/json",
    )

    # time.sleep(2)
    token = json.loads(res_login.data.decode())["auth_token"]
    res = client.get(
        "/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
        content_type="application/json",
    )
    data = json.loads(res.data.decode())
    assert res.status_code == 401
    assert res.content_type == "application/json"
    assert "Signature expired. Please login again." in data["message"]
    assert "fail" in data["status"]


def test_invalid_logout(test_app, test_database):
    client = test_app.test_client()
    res = client.get(
        "/auth/logout",
        headers={"Authorization": "Bearer invalid"},
        content_type="application/json",
    )
    data = json.loads(res.data.decode())
    assert res.status_code == 401
    assert res.content_type == "application/json"
    assert "Invalid token. Please login again." in data["message"]
    assert "fail" in data["status"]


def test_user_status(test_app):
    add_user("testz", "testz@test.com", "test")
    client = test_app.test_client()
    current_app.config["TOKEN_EXPIRATION_SECONDS"] = 3
    res_login = client.post(
        "/auth/login",
        data=json.dumps({"email": "testz@test.com", "password": "test"}),
        content_type="application/json",
    )

    token = json.loads(res_login.data.decode())["auth_token"]
    res = client.get(
        "/auth/status",
        headers={"Authorization": f"Bearer {token}"},
        content_type="application/json",
    )
    data = json.loads(res.data.decode())
    assert res.status_code == 200
    assert res.content_type == "application/json"
    assert "success" in data["status"]
    assert data["data"] is not None
    assert data["data"]["username"] == "testz"
    assert data["data"]["email"] == "testz@test.com"
    assert data["data"]["active"] is True


def test_user_status_invalid(test_app, test_database):
    client = test_app.test_client()
    res = client.get(
        "/auth/status",
        headers={"Authorization": f"Bearer invalid_token"},
        content_type="application/json",
    )
    data = json.loads(res.data.decode())
    assert res.status_code == 401
    assert res.content_type == "application/json"
    assert "fail" in data["status"]
    assert "Invalid token. Please login again." in data["message"]
