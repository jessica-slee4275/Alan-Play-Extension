# auth_routes.py
import os, datetime, jwt
from flask import Blueprint, request, jsonify, make_response
from models import db, User
from functools import wraps

bp = Blueprint("auth", __name__, url_prefix="/auth")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
JWT_ALG = "HS256"

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    email = (data.get("email") or "").lower().strip()
    password = data.get("password") or ""
    role_hint = (data.get("role") or "").lower().strip()  # 'admin' | 'team_member'

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401
    if role_hint and role_hint != user.role:
        return jsonify({"error": "Role mismatch"}), 403

    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
    return jsonify({"token": token, "role": user.role, "email": user.email})

@bp.route("/me", methods=["GET"])
def me():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401
    token = auth.split(" ", 1)[1]
    try:
        data = jwt.decode(token, os.getenv("JWT_SECRET", "dev-secret"), algorithms=[JWT_ALG])
        return jsonify({"id": data["sub"], "email": data["email"], "role": data["role"]})
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

def current_claims():
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    try:
        print("AUTH HEADER:", auth[:60], "..." if len(auth) > 60 else "")
        if not auth.startswith("Bearer "):
            return None
        token = auth.split(" ", 1)[1]
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception as e:
        print("JWT DECODE ERROR:", repr(e))
        return None

def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == "OPTIONS":
            return make_response(("", 204))
        claims = current_claims()
        if not claims:
            print("AUTH FAIL: no/invalid token on", request.method, request.path)
            return jsonify({"error": "Admin only"}), 403
        if claims.get("role") != "admin":
            print("AUTH FAIL: wrong role:", claims.get("role"))
            return jsonify({"error": "Admin only"}), 403
        return fn(*args, **kwargs)
    return wrapper