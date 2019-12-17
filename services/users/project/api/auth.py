from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import exc, or_

from project import bcrypt, db
from project.api.users.models import User


auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/auth/register", methods=["POST"])
def register_user():
    post_data = request.get_json()

    res = {"status": "fail", "message": "Invalid payload."}

    if not post_data:
        return jsonify(res), 400

    username = post_data.get("username")
    email = post_data.get("email")
    password = post_data.get("password")

    if not username or not email or not password:
        return jsonify(res), 400

    try:
        user = User.query.filter(
            or_(User.username == username, User.email == email)
        ).first()

        if user:
            res["message"] = "Sorry, that user already exists."
            return jsonify(res), 400
        else:
            new_user = User(username=username, email=email, password=password)
            db.session.add(new_user)
            db.session.commit()
            auth_token = new_user.encode_auth_token(new_user.id)
            current_app.logger.debug(f"Auth Token: {auth_token}, {type(auth_token)}")
            current_app.logger.debug(f"Auth Token Decode: {auth_token.decode()}")
            res["status"] = "success"
            res["message"] = "Successfully registered."
            res["auth_token"] = auth_token.decode()
            return jsonify(res), 201

    except (exc.IntegrityError, ValueError):
        db.session.rollback()
        return jsonify(res), 400


@auth_blueprint.route("/auth/login", methods=["POST"])
def login_user():
    post_data = request.get_json()

    res = {"status": "fail", "message": "Invalid payload."}

    if not post_data:
        return jsonify(res), 400

    email = post_data.get("email")
    password = post_data.get("password")

    if not email or not password:
        res["message"] = "Email or password is incorrect."
        return jsonify(res), 400

    try:
        user = User.query.filter_by(email=email).first()
        print(user)
        if user and bcrypt.check_password_hash(user.password, password):
            auth_token = user.encode_auth_token(user.id)
            current_app.logger.debug(f"Auth Token: {auth_token}, {type(auth_token)}")
            current_app.logger.debug(f"Auth Token Decode: {auth_token.decode()}")
            if auth_token:
                res["status"] = "success"
                res["message"] = "Login successful"
                res["auth_token"] = auth_token.decode()
                return jsonify(res), 200
        else:
            res["message"] = "Email or password is incorrect."
            return jsonify(res), 401
    except Exception:
        res["message"] = "Error, please try again."
        return jsonify(res), 500


@auth_blueprint.route("/auth/logout", methods=["GET"])
def logout_user():
    auth_header = request.headers.get("Authorization")
    res = {"status": "fail", "message": "Token invalid."}

    if auth_header:
        auth_token = auth_header.split(" ")[1]
        response = User.decode_auth_token(auth_token)
        if not isinstance(response, str):
            res["status"] = "success"
            res["message"] = "Successfully logged out."
            return jsonify(res), 200
        else:
            res["message"] = response
            return jsonify(res), 401
    else:
        return jsonify(res), 403


@auth_blueprint.route("/auth/status", methods=["GET"])
def get_user_status():
    auth_header = request.headers.get("Authorization")
    res = {"status": "fail", "message": "Token invalid."}
    if auth_header:
        auth_token = auth_header.split(" ")[1]
        response = User.decode_auth_token(auth_token)
        if not isinstance(response, str):
            user = User.query.filter_by(id=response).first()
            res["status"] = "success"
            res["message"] = "Success."
            res["data"] = user.to_json()
            return jsonify(res), 200
        else:
            res["message"] = response
            return jsonify(res), 401
    else:
        return jsonify(res), 401


@auth_blueprint.route("/auth/ping", methods=["GET"])
def auth_ping():
    return {"status": "success", "ping": "pong!"}
