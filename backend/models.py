from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Challenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    team_members = db.Column(db.Text, nullable=False)  # JSON 
    reward = db.Column(db.String(255), nullable=False)
    d_day = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        tm = (self.team_members or "").strip()
        team_list = [x.strip() for x in tm.split(",") if x.strip()] if tm else []
        return {
            "id": self.id,
            "title": self.title,
            "reward": self.reward,
            "d_day": self.d_day,
            "team_members": self.team_members,      
            "team_members_list": team_list,        
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(32), nullable=False, default="team_member")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw):
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.password_hash, raw)