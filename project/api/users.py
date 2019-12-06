from flask import Blueprint, request
from flask_restful import Resource, Api
from sqlalchemy import exc

from project import db
from project.api.models import User

users_blueprint = Blueprint('users', __name__)
api = Api(users_blueprint)

class Users(Resource):
    def post(self):
        post_data = request.get_json()

        res = {
            'status': 'fail',
            'message': 'invalid payload'
        }

        if not post_data:
            return res, 400

        username = post_data.get('username')
        email = post_data.get('email')

        try:
            user = User.query.filter_by(email=email).first()
            if not user:
                db.session.add(User(username=username, email=email))
                db.session.commit()

                res = {
                    'status': 'success',
                    'message': f'{email} was added!'
                }

                return res, 201
            else:
                res['message'] = 'Sorry. That email already exists.'
                return res, 400 
        except exc.IntegrityError:
            db.session.rollback()
            return res, 400


api.add_resource(Users, '/users')