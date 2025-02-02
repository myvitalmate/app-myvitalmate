from django.urls import path

from root.views.chat.chat_view import ChatView

urlpatterns = [
    path('message/', ChatView.as_view(), name='chat-message'),
]
