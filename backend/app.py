from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db, Challenge, User
from datetime import datetime
from auth_routes import bp as auth_bp
from auth_routes import require_admin

app = Flask(__name__)
CORS(app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],)

# DB 
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "instance" / "db.sqlite3"
DB_PATH.parent.mkdir(parents=True, exist_ok=True) 
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH.as_posix()}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# init; create db table
with app.app_context():
    db.create_all()
    # Simple Seed
    if not User.query.filter_by(email="admin@demo.com").first():
        u = User(email="admin@demo.com", role="admin"); u.set_password("admin123"); db.session.add(u)
    if not User.query.filter_by(email="member@demo.com").first():
        u = User(email="member@demo.com", role="team_member"); u.set_password("member123"); db.session.add(u)
    db.session.commit()

def _norm_team_members(v):
    if v is None:
        return None
    if isinstance(v, list):
        return ",".join(str(x).strip() for x in v)
    return str(v).strip()


app.register_blueprint(auth_bp)

@app.get("/health")
def health(): return jsonify(ok=True)

@app.route("/api/challenges", methods=["POST"])
def create_challenge():
    data = request.json
    challenge = Challenge(
        title=data["title"],
        team_members=_norm_team_members(data.get("team_members")),
        reward=data["reward"],
        d_day=data["d_day"]
    )
    db.session.add(challenge)
    db.session.commit()
    return jsonify({"message": "Challenge created", "challenge": challenge.to_dict()}), 201

@app.route("/api/challenges", methods=["GET"])
def get_challenges():
    challenges = Challenge.query.all()
    return jsonify([c.to_dict() for c in challenges])

@app.get("/api/challenge/<int:cid>")
def get_challenge(cid):
    c = Challenge.query.get_or_404(cid)
    return jsonify(c.to_dict())

@app.route("/api/challenges/<int:cid>", methods=["PUT", "OPTIONS"])
@require_admin
def update_challenge(cid):
    c = Challenge.query.get_or_404(cid)
    data = request.get_json(force=True) or {}
    c.title = data.get("title", c.title)
    if "team_members" in data:
        c.team_members = _norm_team_members(data.get("team_members"))
    c.reward = data.get("reward", c.reward)
    c.d_day = data.get("d_day", c.d_day)
    db.session.commit()
    return jsonify(c.to_dict())

@app.route("/api/challenges/<int:cid>", methods=["DELETE", "OPTIONS"])
@require_admin
def delete_challenge(cid):
    c = Challenge.query.get_or_404(cid)
    db.session.delete(c)
    db.session.commit()
    return jsonify({"ok": True, "deleted_id": cid})

if __name__ == "__main__":
    app.run(debug=True)
