# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first
COPY app/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all Flask app files
COPY app/ .

# Expose Flask port
EXPOSE 5000

# Environment variables
ENV PYTHONUNBUFFERED=1

# Run Flask app
CMD ["python", "app.py"]