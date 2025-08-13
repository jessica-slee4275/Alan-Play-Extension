# auth_routes.py
import os, datetime, jwt
from flask import Blueprint, request, jsonify
from models import db, User

bp = Blueprint("auth", __name__, url_prefix="/auth")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALG = "HS256"

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
    token = jwt.encode(payload, JWT_SECRET, algorithm=ALG)
    return jsonify({"token": token, "role": user.role, "email": user.email})

@bp.route("/me", methods=["GET"])
def me():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401
    token = auth.split(" ", 1)[1]
    try:
        data = jwt.decode(token, os.getenv("JWT_SECRET", "dev-secret"), algorithms=[ALG])
        return jsonify({"id": data["sub"], "email": data["email"], "role": data["role"]})
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
