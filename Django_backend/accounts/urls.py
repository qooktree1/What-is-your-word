from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/kakao/login/', views.kakao_get_login),
    path('api/v1/kakao/logout/', views.kakao_logout),
    path('api/v1/kakao/redirect/', views.kakao_redirect),
]
