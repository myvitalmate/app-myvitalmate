from django.urls import path, include

urlpatterns = [
    # path('chat/', include('root.urls.chat_urls')),
    path('recipe/', include('root.urls.recipe_urls')),
]
