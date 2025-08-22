# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Si tu as déjà des modèles définis dans database.classes.*
# utilise exactement ces imports (adapte le path si besoin)
from database.classes.monster import Monster
from database.classes.leader_skill import LeaderSkill

app = Flask(__name__)
CORS(app)  # autorise toutes les origines (pour dev). Pour prod, restreindre.

# Chemin vers ta DB sqlite (relatif au backend). Adapte si besoin.
engine = create_engine("sqlite:///database.db", connect_args={"check_same_thread": False})
Session = sessionmaker(bind=engine)

@app.route("/monsters", methods=["GET"])
def get_monsters():
    session = Session()
    monsters = session.query(Monster).all()

    result = []
    for m in monsters:
        leader = getattr(m, "leader_skill", None)
        monster_data = {
            "id": m.id,
            "name": m.name,
            "stars": m.stars,
            "image": getattr(m, "image", None),
            "element": getattr(m, "element", None),
            "archetype": getattr(m, "archetype", None),
            "nb_skill_ups": getattr(m, "nb_skill_ups", None),
            "leader_skill": {
                "id": leader.id if leader else None,
                "attribute": leader.attribute if leader else None,
                "amount": leader.amount if leader else None,
                "area": leader.area if leader else None,
                "element": leader.element if leader else None
            } if leader else None,
        }
        result.append(monster_data)

    session.close()
    return jsonify(result)


@app.route("/monsters/<int:monster_id>", methods=["GET"])
def get_monster(monster_id):
    session = Session()
    m = session.query(Monster).get(monster_id)
    if not m:
        session.close()
        return jsonify({"error": "not found"}), 404

    leader = getattr(m, "leader_skill", None)
    monster_data = {
        "id": m.id,
        "name": m.name,
        "stars": m.stars,
        "image": getattr(m, "image", None),
        "element": getattr(m, "element", None),
        "archetype": getattr(m, "archetype", None),
        "nb_skill_ups": getattr(m, "nb_skill_ups", None),
        "leader_skill": {
            "id": leader.id if leader else None,
            "attribute": leader.attribute if leader else None,
            "amount": leader.amount if leader else None,
            "area": leader.area if leader else None,
            "element": leader.element if leader else None
        } if leader else None,
    }
    session.close()
    return jsonify(monster_data)


if __name__ == "__main__":
    # expose sur 0.0.0.0 pour y accéder depuis d'autres appareils (ex: téléphone Expo).
    app.run(debug=True, host="0.0.0.0", port=5050)
