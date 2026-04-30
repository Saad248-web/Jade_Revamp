import rawpy
# import imageio
from PIL import Image
import os

files = [
    (r"public\Home Page\2-Experiences\Wellness.CR2", r"public\Home Page\2-Experiences\Wellness.webp"),
    (r"public\Experiences\Weekend Getaways\2-What Weekends Look like\Nature & Nearby Escapes.CR2", r"public\Experiences\Weekend Getaways\2-What Weekends Look like\Nature & Nearby Escapes.webp")
]

def convert():
    for src, dst in files:
        if not os.path.exists(src):
            print(f"Skipping missing file: {src}")
            continue
        print(f"\nOpening RAW image: {src}")
        try:
            with rawpy.imread(src) as raw:
            # Postprocess the raw image into an RGB array
            # use_camera_wb=True uses the white balance recorded by the camera
            # no_auto_bright=False allows for automatic brightness adjustment
            # bright=1.0 is the default brightness multiplier
            rgb = raw.postprocess(use_camera_wb=True, no_auto_bright=False, bright=1.0)
            
            print("Postprocessing complete. Converting to Image object...")
            # Convert the RGB array to a PIL Image
            img = Image.fromarray(rgb)
            
            # Optional: Resize if needed, similar to the sharp script
            # Max width 2000px
            max_size = 2000
            if img.width > max_size:
                ratio = max_size / img.width
                new_size = (max_size, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                print(f"Resized image to {new_size}")

            print(f"Saving as WebP: {dst}")
            # Save as WebP with quality 80
            img.save(dst, format="WEBP", quality=80)
            print("Conversion successful!")
            
            # Verify file exists and show size
            if os.path.exists(dst):
                size = os.path.getsize(dst)
                print(f"Output file size: {size / 1024 / 1024:.2f} MB")
                
    except Exception as e:
        print(f"Error during conversion: {str(e)}")

if __name__ == "__main__":
    convert()
