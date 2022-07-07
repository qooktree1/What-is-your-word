from django.contrib import admin
from django.urls import path, include
from accounts.views import google_get_user_info

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/words/', include('words.urls')),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/accounts/', include('dj_rest_auth.urls')),
    path('api/v1/accounts/signup/', include('dj_rest_auth.registration.urls')),

    path('api/v1/accounts/google/login/callback/', google_get_user_info)
]
