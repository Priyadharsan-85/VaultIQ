FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run training to ensure model exists
RUN python train.py

CMD ["python", "app.py"]
