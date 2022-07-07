from django.db import models
from django.conf import settings 

# Create your models here.

class Word(models.Model):
    name = models.CharField(max_length=30)
    meaning = models.TextField()
    # image_path = models.TextField()
    user = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='word')

    def __str__(self):
        return self.name


class Image(models.Model):
    image_path = models.TextField()
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='word')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user')


'''
ew1 = 14e9a31be8eeace5bb5aa9be9d1501180d69412e
ew2 = abb1d34a9ee0cd47f46eb9cf3cb5cd43065312df
ew3 = c2d24c03cce79a3c13d01d7f6e9de410ec3a82e6
'''

'''
image 여러개를 불러와서 하나 선택하는 기능으로 할꺼면
image 모델을 생성해서 그 안에 word를 forienkey로 받아야 할 것 같습니당
'''