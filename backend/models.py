from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Challenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    team_members = db.Column(db.Text, nullable=False)  # JSON 
    reward = db.Column(db.String(255), nullable=False)
    d_day = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "teamMembers": self.team_members.split(","),  # to list
            "reward": self.reward,
            "dDay": self.d_day,
            "created_at": self.created_at.isoformat(),
        }
