from flask import Blueprint, request
from flask_restful import Api, Resource
from sqlalchemy import exc

from project import db
from project.api.users.models import User

users_blueprint = Blueprint("users", __name__)
api = Api(users_blueprint)


class UserList(Resource):
    def post(self):
        post_data = request.get_json()

        res = {"status": "fail", "message": "invalid payload"}

        if not post_data:
            return res, 400

        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")

        try:
            user = User.query.filter_by(email=email).first()
            if not user:
                db.session.add(User(username=username, email=email, password=password))
                db.session.commit()

                res = {"status": "success", "message": f"{email} was added!"}

                return res, 201
            else:
                res["message"] = "Sorry. That email already exists."
                return res, 400
        except exc.IntegrityError:
            db.session.rollback()
            return res, 400
        except (exc.IntegrityError, ValueError):
            db.session.rollback()
            return res, 400

    def get(self):
        res = {
            "status": "success",
            "data": {"users": [user.to_json() for user in User.query.all()]},
        }

        return res, 200


class Users(Resource):
    def get(self, user_id):
        res = {"status": "fail", "message": "There is no user with that user_id"}

        try:
            user = User.query.filter_by(id=int(user_id)).first()

            if not user:
                return res, 404
            else:
                res = {
                    "status": "success",
                    "data": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "active": user.active,
                    },
                }

                return res, 200
        except ValueError:
            return res, 404

    def delete(self, user_id):
        res = {"status": "fail", "message": "There is no user with that user_id"}

        try:
            user = User.query.filter_by(id=int(user_id)).first()

            if not user:
                return res, 404
            else:
                db.session.delete(user)
                db.session.commit()

                res = {"status": "success", "message": f"{user.email} was removed"}

                return res, 200
        except ValueError:
            return res, 404

    def put(self, user_id):
        post_data = request.get_json()
        res = {"status": "fail", "message": "Invalid payload"}

        if not post_data:
            return res, 400

        username = post_data.get("username")
        email = post_data.get("email")

        if not username or not email:
            return res, 400

        try:
            user = User.query.filter_by(id=int(user_id)).first()
            if not user:
                res["message"] = "There is no user with that user_id"
                return res, 404
            else:
                user.username = username
                user.email = email
                db.session.commit()
                res["status"] = "success"
                res["message"] = f"{user.id} was updated"
                return res, 200
        except exc.IntegrityError:
            db.session.rollback()
            return res, 400


api.add_resource(UserList, "/users")
api.add_resource(Users, "/users/<user_id>")
