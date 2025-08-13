from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db, Challenge, User
from datetime import datetime
from auth_routes import bp as auth_bp

app = Flask(__name__)
CORS(app)

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

app.register_blueprint(auth_bp)

@app.get("/health")
def health(): return jsonify(ok=True)

@app.route("/api/challenges", methods=["POST"])
def create_challenge():
    data = request.json
    challenge = Challenge(
        title=data["title"],
        team_members=",".join(data["teamMembers"]),
        reward=data["reward"],
        d_day=data["dDay"]
    )
    db.session.add(challenge)
    db.session.commit()
    return jsonify({"message": "Challenge created", "challenge": challenge.to_dict()}), 201

@app.route("/api/challenges", methods=["GET"])
def get_challenges():
    challenges = Challenge.query.all()
    return jsonify([c.to_dict() for c in challenges])

@app.route("/api/challenges/<int:challenge_id>", methods=["DELETE"])
def delete_challenge(challenge_id):
    challenge = Challenge.query.get(challenge_id)
    if not challenge:
        return jsonify({"error": "Challenge not found"}), 404
    db.session.delete(challenge)
    db.session.commit()
    return jsonify({"message": f"Challenge {challenge_id} deleted."}), 200

if __name__ == "__main__":
    app.run(debug=True)
