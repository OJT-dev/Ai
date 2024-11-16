#!/bin/bash

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run TypeScript tests
echo "Running frontend tests..."
npm test

# Run Python tests
echo "Running backend tests..."
python -m pytest tests/

# Run Gradio tests
echo "Running Gradio interface tests..."
python -m pytest tests/test_gradio.py

# Check test results
if [ $? -eq 0 ]; then
    echo "All tests passed!"
    exit 0
else
    echo "Tests failed!"
    exit 1
fi 