from django.shortcuts import get_object_or_404
from .models import Word, Image
from .serializers import WordListSerializer, ImageSerializer, WordSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET', 'POST', 'DELETE'])
def index(request):
    user = request.user


    # 해당하는 유저의 단어 데이터를 가져온다.
    def get_words():
        tmp_words = Word.objects.all().filter(user=user.pk)[::-1]  # 전체 단어 중 해당 유저가 검색했던 단어만 가져오기
        serializer = WordListSerializer(tmp_words, many=True)  # JSON 형태로 응답 보내기 위해 serializer로 바꿔주기
        data = serializer.data  # -> 해당 유저가 검색했던 단어들 JSON
        
        result = []
        
        for word in data:  # -> 단어를 한 개씩 보겠다 (word type = dictionary)
            tmp_image = Image.objects.filter(word=word['id'], user=user.pk)  # 해당 유저 & 해당 단어에 연결되는 image
            image_serializer = ImageSerializer(tmp_image[0])  # 의 JSON (한 개) (dictionary)

            word.update(image_serializer.data)
            result.append(word)
            
        return Response(result)  # {"id", "name", "meaning", "user", "image_path", "word"}

    
    def post_word():
        words = Word.objects.all()
        serializer = WordSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            if len(words) > 0:
                tmp_word = Word.objects.filter(name=serializer.validated_data.get('name'))  # DB에 없는 단어면 len == 0
                if len(tmp_word) == 0:  # 처음 저장되는 단어인 경우 단어 저장
                    word = Word()
                    word.name = serializer.validated_data.get('name')
                    word.meaning = serializer.validated_data.get('meaning')
                    word.save()

                word_data = get_object_or_404(Word, name=request.data['name'])
                
                tmp_image = Image.objects.filter(user=user.id, word=word_data.id)
                if len(tmp_image) == 0:  # 유저가 해당 단어를 처음 저장하는 경우 (이미지가 아직 없음)
                    image = Image()
                    image.image_path = serializer.validated_data.get('image_path').get('image_path')
                    image.user_id = user.id
                    image.word_id = word_data.id
                    image.save()
                else:  # 유저가 이미 해당 단어에 대해 이미지를 저장한 적이 있으면 새 이미지로 업데이트
                    tmp_image[0].image_path = serializer.validated_data.get('image_path').get('image_path')
                    tmp_image[0].save()

                word_data.user.add(user)
                return Response({})

            elif len(words) == 0:  # 젤 처음 사용자를 위한 것
                word = Word()
                word.name = serializer.validated_data.get('name')
                word.meaning = serializer.validated_data.get('meaning')
                word.save()

                word_data = get_object_or_404(Word, name=request.data.get('name'))

                image = Image()
                image.image_path = serializer.validated_data.get('image_path').get('image_path')
                image.user_id = user.id
                image.word_id = word_data.id
                image.save()

                word_data.user.add(user)
                return Response({})
        

    def delete_word():
        word = get_object_or_404(Word, name=request.data['name'])
        word.user.remove(user)
        return Response({})


    if request.method == 'GET':
        return get_words()
    elif request.method == 'POST':
        return post_word()
    elif request.method == 'DELETE':
        return delete_word()