import os

import openai
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_ollama import OllamaLLM
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

template = (
    "You are my diet specialist and I have the following questions: {user_input}\n"
    "Please follow these instructions carefully:\n\n"
    "1. **No Extra Content:** Do not include any additional text, comments, or explanations in your response.\n"
    "2. **Empty Response:** If no information matches the description, return an empty string ('')."
)

prompt = PromptTemplate.from_template(template)

class ChatService:
    # Class variables hold shared state, which can cause issues in distributed environments (e.g., load balancing)
    # Each instance of the application might have its own model instance, leading to inefficiencies or inconsistencies.

    _model_instance = None
    _current_model_name = None

    @classmethod
    def create_model(cls, model_name):
        """
        Creates and returns the appropriate LLM model based on the model_name.
        Reuses the model instance if it's the same as the previous one.
        """
        if cls._model_instance and cls._current_model_name == model_name:
            return cls._model_instance  # Reuse existing model

        if model_name == "gpt":
            cls._model_instance = OpenAI(model="gpt-3.5-turbo-instruct", api_key=api_key)
        else:
            cls._model_instance = OllamaLLM(model="llama3")

        cls._current_model_name = model_name
        return cls._model_instance

    @classmethod
    def parse_user_input(cls, user_input):
        try:
            chain = prompt | cls._model_instance
            ai_response = chain.invoke({"user_input": user_input})
            return ai_response
        except Exception as e:
            return f"An error occurred: {e}"
