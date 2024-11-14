from setuptools import setup, find_packages

setup(
    name="life_management_agency",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'agency_swarm',
        'pydantic',
        'python-dotenv',
        'tavily-python',
        'openai',  # Required for OpenRouter compatibility
        'requests'  # Required for API calls
    ],
)
