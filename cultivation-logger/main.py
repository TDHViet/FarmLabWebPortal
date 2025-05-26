import cv2
import requests
import time
import decouple

# Load environment variables
API_URL = decouple.config("API_URL")
AUTH_URL = decouple.config("AUTH_URL")
USERNAME = decouple.config("AUTH_USERNAME")
PASSWORD = decouple.config("AUTH_PASSWORD")
FIELD_NAME = "image"
CAPTURE_INTERVAL = 5  # seconds

def authenticate():
    # Replace with your actual authentication logic
    payload = {
        "username": USERNAME,
        "password": PASSWORD
    }
    try:
        response = requests.post(AUTH_URL, data=payload)
        if response.status_code == 200:
            print("Authentication successful")
            return response.json().get("token")
        else:
            print("Authentication failed")
            return None
    except Exception as e:
        print(f"Authentication error: {e}")
        return None

def capture_and_send():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Cannot open camera")
        return
    token = authenticate()
    if token:
        headers = {"Authorization": f"Token {token}"}
    else:
        return
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame")
                break

            # Encode frame as JPEG
            ret, buf = cv2.imencode(".jpg", frame)
            if not ret:
                print("Failed to encode frame")
                continue

            files = {FIELD_NAME: ("image.jpg", buf.tobytes(), "image/jpeg")}

            try:
                response = requests.post(API_URL, files=files, headers=headers)
                print(f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                print(f"Failed to send image: {e}")

            time.sleep(CAPTURE_INTERVAL)
    finally:
        cap.release()

if __name__ == "__main__":
    capture_and_send()