import os
import time

from celery import Celery

from .gennifer_api import generateInputs, run, parseOutput

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")
celery.conf.task_routes = {"create_scode_task": {"queue": 'scode'}}

@celery.task(name="create_scode_task")
def create_scode_task(zenodo_id, z, nIter, nRep):
    inputs, PTData = generateInputs(zenodo_id)
    res = run(inputs, z, nIter, nRep, PTData)
    output = parseOutput(res, PTData)
    return output
