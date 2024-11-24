from setuptools import setup, find_packages

setup(
    name="life_management_agency",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.104.1",
        "uvicorn>=0.24.0",
        "openai>=1.3.5",
        "python-dotenv>=1.0.0",
        "httpx>=0.25.2",
        "pydantic>=2.5.1",
        "agency-swarm>=0.1.0",
        "python-jose>=3.3.0",
        "passlib>=1.7.4",
        "bcrypt>=4.0.1",
        "python-multipart>=0.0.6",
        "certifi>=2023.11.17"
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.3",
            "black>=23.11.0",
            "isort>=5.12.0",
            "mypy>=1.7.1",
            "flake8>=6.1.0",
        ]
    },
    python_requires=">=3.12",
    author="Your Name",
    author_email="your.email@example.com",
    description="A comprehensive AI-powered life management system with specialized agents",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/life_management_agency",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.12",
        "Operating System :: OS Independent",
        "Topic :: Office/Business :: Scheduling",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    entry_points={
        "console_scripts": [
            "life-management-agency=life_management_agency.agency:main",
        ],
    },
    package_data={
        "life_management_agency": [
            "agency_manifesto.md",
            "*.json",
            "*.env.example"
        ],
    },
)
