import os
import json
import requests_cache

from flask import Flask
from flask_restful import Resource, Api, reqparse
from celery.result import AsyncResult

from .tasks import create_scode_task

def create_app(test_config=None):
# Initialise environment variables

    # Read secret key
    secret_key_filepath = os.environ.get("SECRET_KEY_FILE", None)
    if secret_key_filepath:
        with open(secret_key_filepath, 'r') as sk_file:
            SECRET_KEY = sk_file.readline().strip()
    else:
        SECRET_KEY = 'dev'

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
            SECRET_KEY=SECRET_KEY,
            )
    if test_config is None:
        # Load this instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the testing config if passed
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Install a requests cache
    requests_cache.install_cache('scode_cache')
    
    # Build flask RESTful API
    api = Api(app)

    parser = reqparse.RequestParser()
    parser.add_argument('zenodo_id')

    class RunAlgorithm(Resource):
        
        def post(self):
            args = parser.parse_args()
            z = args.get('z')
            nIter = args.get('nIter')
            nRep = args.get('nRep')
            if not z:
                z = 10
            if not nIter:
                nIter = 1000
            if not nRep:
                nRep = 6


            task = create_scode_task.delay(args["zenodo_id"], z, nIter, nRep)
            return {"task_id": task.id}, 200

        def get(self, task_id):
            task_result = AsyncResult(task_id)
            result = {
                    "task_id": task_id,
                    "task_status": task_result.status,
                    "task_result": task_result.result,
                    }
            return result, 200

    class AlgorithmInfo(Resource):

        def get(self):
            # Specify algorithm info here.
            info = {
                    "name": 'scode',
                    "description": 'The current implementation of SCODE takes an expression matrix and a list of genes as input. It produces a ranked list of edges as output, which we used directly in our analysis.',
                    "edge_weight_type": '',
                    "edge_weight_description": "",
                    }
            return info, 200


            
    api.add_resource(RunAlgorithm, '/run', '/status/<task_id>')
    api.add_resource(AlgorithmInfo, '/info')

    return app
