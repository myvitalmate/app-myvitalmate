from rest_framework.response import Response
from rest_framework.views import APIView


class RecipeSearchView(APIView):
    def get(self, request):
        query = request.GET.get("query", "")
        return Response({"recipes": f"Results for {query}"})
