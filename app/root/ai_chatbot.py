import os

import openai
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_ollama import OllamaLLM

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

# local chatbot for testing
llm = OllamaLLM(model="llama3")

# AIChatbot using OpenAI API_KEY
# llm = OpenAI(model="gpt-3.5-turbo-instruct", api_key=api_key)

# Define the prompt template
template = (
    "You are my diet specialist and I have the following questions: {user_input}\n"
    "Please follow these instructions carefully:\n\n"
    "1. **No Extra Content:** Do not include any additional text, comments, or explanations in your response.\n"
    "2. **Empty Response:** If no information matches the description, return an empty string ('')."
)

prompt = PromptTemplate.from_template(template)


# Define the function to parse user input
def parse_user_input(user_input):
    try:
        # Create the LLM chain
        chain = prompt | llm
        # Invoke the chain with the user input
        ai_response = chain.invoke({"user_input": user_input})
        return ai_response
    except Exception as e:
        return f"An error occurred: {e}"
