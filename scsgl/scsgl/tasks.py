import os
import time

from celery import Celery

from .gennifer_api import generateInputs, run, parseOutput

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")
celery.conf.task_routes = {"create_scsgl_task": {"queue": 'scsgl'}}

@celery.task(name="create_scsgl_task")
def create_scsgl_task(zenodo_id, pos_density, neg_density, assoc):
    inputs = generateInputs(zenodo_id)
    res = run(inputs, pos_density, neg_density, assoc)
    output = parseOutput(res)
    return output
