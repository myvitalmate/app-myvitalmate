from dotenv import load_dotenv
import openai
import os

# Lade die .env-Datei
load_dotenv()

# Hole den API-Schlüssel
api_key = os.getenv("OPENAI_API_KEY")

# API-Schlüssel verwenden
openai.api_key = api_key


def user_input():
    if request.method == 'POST':
        user_input = request.POST.get('user_input', '')
        