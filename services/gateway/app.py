from pathlib import Path
from flask import Flask, send_from_directory, request, Response
from flask_cors import CORS
import os, requests

DIST_DIR = Path(__file__).resolve().parents[1] / "web-frontend" / "dist"
BIRTH_URL   = os.getenv("BIRTH_URL",   "http://127.0.0.1:5001")
VEHICLE_URL = os.getenv("VEHICLE_URL", "http://127.0.0.1:5002")
HOUSING_URL = os.getenv("HOUSING_URL", "http://127.0.0.1:5003")

def proxy(base):
    def _h(path):
        url = f"{base}/{path}"
        resp = requests.request(
            method=request.method, url=url,
            headers={k:v for k,v in request.headers if k.lower()!="host"},
            data=request.get_data(), cookies=request.cookies,
            allow_redirects=False, params=request.args,
        )
        excluded = {"content-encoding","transfer-encoding","connection"}
        headers = [(k,v) for k,v in resp.raw.headers.items() if k.lower() not in excluded]
        return Response(resp.content, resp.status_code, headers)
    return _h

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/api/birth/<path:path>", methods=["GET","POST","PUT","PATCH","DELETE"])
    def birth_proxy(path):   return proxy(BIRTH_URL)(path)

    @app.route("/api/vehicle/<path:path>", methods=["GET","POST","PUT","PATCH","DELETE"])
    def vehicle_proxy(path): return proxy(VEHICLE_URL)(path)

    @app.route("/api/housing/<path:path>", methods=["GET","POST","PUT","PATCH","DELETE"])
    def housing_proxy(path): return proxy(HOUSING_URL)(path)

    @app.route("/")
    def index(): return send_from_directory(DIST_DIR, "index.html")

    @app.route("/assets/<path:f>")
    def assets(f): return send_from_directory(DIST_DIR / "assets", f)

    @app.get("/health")
    def health(): return {"status":"ok","gateway":True}
    return app
