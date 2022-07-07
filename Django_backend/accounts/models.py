from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    social = models.CharField(max_length=10)
    # social_id = models.CharField(max_length=30)


# class SocialPlatform(models.Model):
#     platform = models.CharField(max_length=20, default=0)


# class SocialUser(models.Model):
#     name = models.CharField(max_length=10)
#     social = models.ForeignKey(SocialPlatform, on_delete=models.CASCADE)
#     social_login_id = models.CharField(max_length=50, blank=True)