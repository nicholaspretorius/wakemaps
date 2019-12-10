from project.tests.utils import add_user, recreate_db


def test_passwords_are_random(test_app):
    recreate_db()
    user_one = add_user("justatest", "test@test.com", "greaterthaneight")
    user_two = add_user("justatest2", "test2@test.com", "greaterthaneight")
    assert user_one.password != user_two.password
