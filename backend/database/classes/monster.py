"""Classe Monster"""
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)
from sqlalchemy.orm import relationship, mapped_column
from database.classes.base import SWdleBase

# Classe Monster
class Monster(SWdleBase):
    __tablename__ = 'monsters'

    name = Column(String(255), nullable=False)

    stars = Column(Integer, nullable=False)

    image = Column(String(255))

    element = Column(String(50))

    archetype = Column(String(50))

    nb_skill_ups = Column(Integer)

    leader_skill_id = mapped_column(ForeignKey("leader_skills.id"))
    leader_skill = relationship("LeaderSkill", back_populates="monsters")

    hp = Column(Integer)

    attack = Column(Integer)

    defense = Column(Integer)

    speed = Column(Integer)

    crit_rate = Column(Integer)

    crit_dmg = Column(Integer)

    resistance = Column(Integer)

    accuracy = Column(Integer)

    skills = relationship("MonsterSkill", back_populates="monster")
