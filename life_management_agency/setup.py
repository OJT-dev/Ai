from setuptools import setup, find_packages

setup(
    name="life_management_agency",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "agency-swarm",
        "python-dotenv",
        "pydantic",
        "gradio",
        "tavily-python"
    ],
)
