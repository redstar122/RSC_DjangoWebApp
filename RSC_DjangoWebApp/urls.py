from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('registration/', include('registration.urls')), # Add this line
    # Add these inside your existing urlpatterns list:
    path(
        'api/',
        include('registration.api_urls')
    ),
    path(
        'accounts/',
        include('django.contrib.auth.urls')
    ),
]