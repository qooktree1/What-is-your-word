from django.shortcuts import redirect
from backend.settings import SOCIAL_OUTH_CONFIG
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
import requests
from .models import User


@api_view(['GET'])
@permission_classes([AllowAny, ])
def kakao_get_login(request):
    CLIENT_ID = SOCIAL_OUTH_CONFIG["KAKAO_REST_API_KEY"]
    REDIRECT_URL = SOCIAL_OUTH_CONFIG["KAKAO_REDIRECT_URI"]
    url = f'https://kauth.kakao.com/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URL}&response_type=code'
    return redirect(url)


@api_view(['POST'])
@permission_classes([AllowAny, ])
def kakao_redirect(request):
    CODE = request.data.keys()

    url = "https://kauth.kakao.com/oauth/token"
    res = {
            'grant_type': 'authorization_code',
            'client_id': SOCIAL_OUTH_CONFIG["KAKAO_REST_API_KEY"],
            'redirect_url': 'http://localhost:3000/oauth/kakao/callback',
            'client_secret': SOCIAL_OUTH_CONFIG["KAKAO_SECRET_KEY"],
            'code': CODE
       }
    headers = {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
    response = requests.post(url, data=res, headers=headers)
    tokenJson = response.json()
    access_token = tokenJson.get('access_token')
    token_type = tokenJson.get('token_type')
    userUrl = "https://kapi.kakao.com/v2/user/me" # 유저 정보 조회하는 uri
    auth = token_type + ' ' + access_token ## 'Bearer '여기에서 띄어쓰기 필수!!
    HEADER = {
        "Authorization": auth,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }
    user = requests.get(userUrl, headers=HEADER).json()
    nickname = user.get('properties').get('nickname')
    social_id = user.get('id')
    social = 'kakao'

    django_user = User.objects.filter(username=social_id, social=social).first()
    if django_user is None:
        django_user = User.objects.create(username=social_id, social=social)
        django_user.set_unusable_password()
        django_user.save()
        tmp = Token.objects.filter(user=django_user)
        if len(tmp) > 0:
            tmp.delete()
        
        token = Token.objects.create(user=django_user)
        return Response({'key': token.key, 'social_id': social_id, 'access_token': access_token, 'nickname': nickname})
        
    else:
        tmp = Token.objects.filter(user=django_user)
        if len(tmp) > 0:
            tmp.delete()

        token = Token.objects.create(user=django_user)
        return Response({'key': token.key, 'social_id': social_id, 'access_token': access_token, 'nickname': nickname})


@api_view(['POST'])
@permission_classes([AllowAny, ])
def kakao_logout(request):
    url = 'https://kapi.kakao.com//v1/user/logout/'
    auth = "Bearer " + request.data.get('access_token')
    HEADER = {
        "Authorization": auth,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }
    Token.objects.filter(key=request.data.get('token')).delete()
    return Response({})