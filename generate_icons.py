import os
from PIL import Image, ImageDraw

def create_icon(size, filename):
    img = Image.new('RGB', (size, size), color = (156, 39, 176)) # Purple for MBTI
    d = ImageDraw.Draw(img)
    d.text((size/3, size/3), "M", fill=(255, 255, 255))
    img.save(filename)
    print(f"Created {filename}")

base_dir = r"C:\Users\User\clawd\chrome_book_mbti\mbti_extension\public\icons"
create_icon(16, os.path.join(base_dir, "icon16.png"))
create_icon(48, os.path.join(base_dir, "icon48.png"))
create_icon(128, os.path.join(base_dir, "icon128.png"))