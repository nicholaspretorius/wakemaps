FROM python:3.7.4-alpine

# install dependencies
RUN apk update && \
    apk add --virtual build-deps openssl-dev libffi-dev gcc python3-dev musl-dev && \
    apk add postgresql-dev && \
    apk add netcat-openbsd

# set environment vars
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install dependencies
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# add app
COPY . /usr/src/app