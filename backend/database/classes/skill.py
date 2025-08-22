"""Classe Skill"""
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
)
from sqlalchemy.orm import relationship
from database.classes.base import SWdleBase


# Classe Skill
class Skill(SWdleBase):
    __tablename__ = 'skills'
    __table_args__ = {'extend_existing': True}

    name = Column(String(255), nullable=False)
    description = Column(Text)
    cooldown = Column(Integer)
    hits = Column(Integer)
    aoe = Column(Boolean)
    passive = Column(Boolean)
    slot = Column(Integer)
    image = Column(String(255))
    nb_progress = Column(Integer)

    monsters = relationship("MonsterSkill", back_populates="skill")
