from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    social = models.CharField(max_length=10)