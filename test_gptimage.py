"""
test_gptimage.py — verifies your OpenAI API key and GPT Image 2 work,
in isolation, before you wire anything into the app.

Local setup:
    pip install openai
    export OPENAI_API_KEY="your_key_here"      # macOS/Linux
    python test_gptimage.py

Colab setup:
    !pip install openai
    Add a secret named OPENAI_API_KEY via the key icon in the left
    sidebar, toggle notebook access on, then just run this cell.

Before your first call, OpenAI may require API Organization
Verification in your developer console — the GPT Image family is
gated behind it. If this script fails with a permissions/verification
error rather than an auth error, that's the fix, not your key.

Expect: a file named test_output.png appears in this folder.
"""

import base64
import os

from openai import OpenAI


def get_api_key():
    try:
        from google.colab import userdata
        key = userdata.get("OPENAI_API_KEY")
        if key:
            return key
    except Exception:
        pass
    return os.environ.get("OPENAI_API_KEY")


api_key = get_api_key()
if not api_key:
    raise SystemExit(
        "No API key found. Set OPENAI_API_KEY as an environment variable "
        "locally, or add it as a Colab secret named OPENAI_API_KEY."
    )

client = OpenAI(api_key=api_key)

# Model ID — this is the one you decided on.
MODEL = "gpt-image-2"

prompt = (
    "A bold, high-contrast background for a YouTube thumbnail: dramatic "
    "orange and blue cinematic lighting, sharp focus, no text, no watermark."
)

result = client.images.generate(model=MODEL, prompt=prompt)

image_base64 = result.data[0].b64_json
if not image_base64:
    print("No image came back. Print the full result to see why:")
    print(result)
else:
    with open("test_output.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
    print("Saved test_output.png — API key and model both work.")
