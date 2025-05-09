FROM python:3.9-slim

# Define healthcheck to ensure container is running
HEALTHCHECK --interval=10s --timeout=5s --retries=5  \
    CMD curl -X GET -H "Accept: application/json" \
        http://localhost:8000/ || exit 1
    
# Install curl
RUN apt-get update && apt-get install -y curl

# Set the working directory in the container
WORKDIR /app/

# Copy the FastAPI application files
COPY ./app/ ./app/

# Copy the requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

RUN pip install fastapi uvicorn

# Expose the port that FastAPI will run on
EXPOSE 8000

# Setup a non-root user
RUN addgroup appgroup --gid 1000 && \
useradd appuser --uid 1000 --gid appgroup --home-dir /app/ && \
chown -R appuser:appgroup /app/
USER 1000:1000

# Command to run the FastAPI app using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "", "--port", "8000"]
