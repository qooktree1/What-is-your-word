from rest_framework import serializers
from .models import Word, Image


class WordListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Word
        fields = '__all__'
        read_only_fields = ('user',)


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = '__all__'
        read_only_fields = ('word', 'user')


class WordSerializer(serializers.ModelSerializer):
    class ImageListSerializer(serializers.ModelSerializer):

        class Meta:
            model = Image
            fields = ('image_path',)
    
    image_path = ImageListSerializer()  # {'image_path': 'asdf'}
    
    class Meta:
        model = Word
        fields = '__all__'
        read_only_fields = ('user',)