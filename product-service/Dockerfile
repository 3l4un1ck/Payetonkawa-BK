FROM python:3.11

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . .

#RUN python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

## Run migrations
# RUN python manage.py makemigrations && python manage.py migrate
#
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
#CMD ["gunicorn", "produitservice.wsgi", "--bind", "0.0.0.0:8000"]
