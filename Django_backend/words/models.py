from django.db import models
from django.conf import settings 

# Create your models here.

class Word(models.Model):
    name = models.CharField(max_length=30)
    meaning = models.TextField()
    user = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='word')

    def __str__(self):
        return self.name


class Image(models.Model):
    image_path = models.TextField()
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='word')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user')