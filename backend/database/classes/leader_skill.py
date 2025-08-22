"""Classe LeaderSkill."""
from sqlalchemy import (
    Column,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from database.classes.base import SWdleBase


# Classe LeaderSkill
class LeaderSkill(SWdleBase):
    __tablename__ = 'leader_skills'

    attribute = Column(String(50))
    amount = Column(Integer)
    area = Column(String(50))
    element = Column(String(50))

    monsters = relationship('Monster', back_populates='leader_skill')
