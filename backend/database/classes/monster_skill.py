"""Classe MonsterSkill"""
from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)
from sqlalchemy.orm import relationship, mapped_column
from database.classes.base import SWdleBase

# Classe MonsterSkill
class MonsterSkill(SWdleBase):
    __tablename__ = 'monsters_skill'

    monster_id = mapped_column(ForeignKey("monsters.id"))
    monster = relationship("Monster", back_populates="skills")

    skill_id = mapped_column(ForeignKey("skills.id"))
    skill = relationship("Skill", back_populates="monsters")
