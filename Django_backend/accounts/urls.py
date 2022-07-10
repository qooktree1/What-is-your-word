from django.urls import path
from . import views

urlpatterns = [
    path('kakao/login/', views.kakao_get_login),
    path('kakao/logout/', views.kakao_logout),
    path('kakao/redirect/', views.kakao_redirect),
]
