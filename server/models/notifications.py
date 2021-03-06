from peewee import ForeignKeyField, TextField

from .base import BaseModel

__all__ = ["Notification"]


class Notification(BaseModel):
    uuid = TextField(primary_key=True)
    message = TextField()

    def __repr__(self):
        return f"<Notification {self.uuid} {self.message[:15]}>"
