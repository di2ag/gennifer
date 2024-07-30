import os
import time

from celery import Celery

from .gennifer_api import generateInputs, run, parseOutput

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")
celery.conf.task_routes = {"create_sincerities_task": {"queue": 'sincerities'}}

@celery.task(name="create_sincerities_task")
def create_sincerities_task(zenodo_id, nBins):
    inputs, PTData = generateInputs(zenodo_id, nBins)
    res = run(inputs, PTData)
    output = parseOutput(res, PTData)
    return output
