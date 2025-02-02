from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response as DRFResponse
from rest_framework.views import APIView

from root.services.chat_service import ChatService


class ChatView(APIView):
    def post(self, request: Request):
        user_input = request.data.get("message", "")
        model_name = request.data.get("model", "llama3.2")

        if not user_input:
            return DRFResponse({"error": "Message field is required."}, status=status.HTTP_400_BAD_REQUEST)

        ChatService.create_model(model_name)  # Ensure model is created or reused
        response = ChatService.parse_user_input(user_input)
        return DRFResponse({"response": response}, status=status.HTTP_200_OK)
