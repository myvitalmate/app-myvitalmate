from rest_framework.response import Response
from rest_framework.views import APIView


class HomeView(APIView):
    def get(self, request):
        query = request.GET.get("query", "")
        return Response({"healthResponse": f"Django Server call successful. You requested: {query}"})
