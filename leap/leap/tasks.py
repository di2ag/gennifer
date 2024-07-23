import os
import time

from celery import Celery

from .gennifer_api import generateInputs, run, parseOutput

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")
celery.conf.task_routes = {"create_leap_task": {"queue": 'leap'}}

@celery.task(name="create_leap_task")
def create_leap_task(zenodo_id, maxLag):
    PTData, inputs = generateInputs(zenodo_id)
    res = run(inputs, maxLag, PTData)
    output = parseOutput(res, PTData)
    return output
