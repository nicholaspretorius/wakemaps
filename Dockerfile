FROM python:3.7.4-alpine

# RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# set environment vars
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# add app
COPY . .

# run
CMD python manage.py run -h 0.0.0.0