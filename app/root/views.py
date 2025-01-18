from django.shortcuts import render, HttpResponse
from .ai_chatbot import parse_user_input

def home(request):
    if request.method == "POST":
        user_input = request.POST.get("user_input", "")

        try:
            response = parse_user_input(user_input)
        except Exception as e:
            response = f"An error occurred: {e}"

        return render(request, "home.html", {"response": response})

    return render(request, "home.html")