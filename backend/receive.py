
imagePath = "../frontend/src/image.jpg"

import requests
import os
import sys

# function to download the image from esp32
def download_image(url):
    response = requests.get(url)

    if response.status_code == 200:
        with open(imagePath, "wb") as f:
            f.write(response.content)
        print(f"Image saved to: {imagePath}")
    else:
        print("Failed to download image. Status code:", response.status_code)

# download the image from the ESP32 camera (must pass URL as command line argument)
download_image(sys.argv[1] if len(sys.argv) > 1 else None)


import base64
from openai import OpenAI
from secrets import API_KEY


client = OpenAI(api_key=API_KEY)

# function to encode the image to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

base64_image = encode_image(imagePath)

# send the image to OpenAI API and get a response
response = client.responses.create(
    model="gpt-4.1",
    input=[
        {
            "role": "user",
            "content": [
                { "type": "input_text", "text": "Give me a detailed description of this image. If applicable, be sure to describe where it is, what it is, the quantity of it, and origin" },
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}",
                },
            ],
        }
    ],
) 

# print the response from OpenAI API
print(response.output_text)
