"""Abstract base class for all classes in the database."""
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer

class SWdleBase(DeclarativeBase):
    """Classe dont héritent toutes les classes"""

    __abstract__ = True

    id = Column(Integer, primary_key=True)

    """Identifiant unique du tuple"""
    def __str__(self):
        """Fonction qui retourne la représentation informelle
        de l'objet instance de la classe SWdleBase."""
        attributs = ", ".join(
            f"{key}={value}"
            for key, value in self.__dict__.items()
            if key != "_sa_instance_state"
        )
        return f"{self.__class__.__name__}({attributs})"

    def __repr__(self):
        """Fonction qui retourne la représentation formelle
        de l'objet instance de la classe SWdleBase."""
        return self.__str__()
