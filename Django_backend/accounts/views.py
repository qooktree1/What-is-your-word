from django.http import JsonResponse
from django.shortcuts import render, redirect
from backend.settings import SOCIAL_OUTH_CONFIG
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
import requests
from .models import User
from pprint import pprint


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
    refresh_token = tokenJson.get('refresh_token')
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
    print(request)
    url = 'https://kapi.kakao.com//v1/user/logout/'
    access_token = request.data.get('access_token')
    auth = "Bearer " + request.data.get('access_token')
    HEADER = {
        "Authorization": auth,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }
    tmp = requests.post(url, headers=HEADER).json()
    Token.objects.filter(key=request.data.get('token')).delete()
    return Response('진짜 끝났다 고생했어')


@api_view(['GET'])
@permission_classes([AllowAny, ])
def google_get_login(request):
    CLIENT_ID = SOCIAL_OUTH_CONFIG['GOOGLE_CLIENT_ID']
    REDIRECT_URL = 'http://127.0.0.1:8000/accounts/google/login/callback/'

    # scope 설정 (어떤 데이터를 받고 싶은지를 scope를 통해 설정)
    url = 'https://accounts.google.com/o/oauth2/auth?client_id={0}&redirect_uri={1}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile'.format(CLIENT_ID, REDIRECT_URL)
    return (redirect(url))


@api_view(['GET'])
@permission_classes([AllowAny, ])
def google_get_user_info(request):
    CODE = request.query_params['code']

    url = "https://oauth2.googleapis.com/token"
    res = {
        'grant_type': 'authorization_code',
        'code': CODE,
        'client_id': SOCIAL_OUTH_CONFIG['GOOGLE_CLIENT_ID'],
        'client_secret': SOCIAL_OUTH_CONFIG['GOOGLE_CLIENT_SECRET'],
        'redirect_uri': 'http://127.0.0.1:8000/accounts/google/login/callback/'
    }
    headers = {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
    response = requests.post(url, data=res, headers=headers)
    tokenJson = response.json()
    print('token Json = ', tokenJson)
    userUrl = 'https://www.googleapis.com/oauth2/v2/userinfo?'
    
    auth = "Bearer "+tokenJson['access_token']
    HEADER = {
        "Authorization": auth,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }
    user = requests.get(userUrl, headers=HEADER).json()
    print('유저!! = ', user)

    nickname = user.get('name')
    social = 'google'

    django_user = User.objects.filter(username=nickname).first()

    if django_user is None:
        django_user = User.objects.create(username=nickname, social=social)
        django_user.set_unusable_password()
        django_user.save()

        token = Token.objects.create(user=django_user)
        return Response({'key': token.key})
    else:
        token = Token.objects.create(user=django_user)
        return Response({'key': token.key})