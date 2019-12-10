# import sys
import os
from flask import Flask
from flask_admin import Admin
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# instantiate db
db = SQLAlchemy()
cors = CORS()
admin = Admin(template_mode="bootstrap3")


def create_app(script_info=None):

    # instantiate app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    db.init_app(app)
    cors.init_app(app)

    if os.getenv("FLASK_ENV") == "development":
        admin.init_app(app)

    from project.api.ping import ping_blueprint
    from project.api.users.views import users_blueprint

    app.register_blueprint(ping_blueprint)
    app.register_blueprint(users_blueprint)

    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app