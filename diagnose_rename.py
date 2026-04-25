
import os
import shutil

folder = r"c:\Users\Admin\Desktop\Jade_ReVamp\public\Villa_Retreats\Jade 735\Hero"
src = os.path.join(folder, ".webp")
dst = os.path.join(folder, "Villa_Wide.webp")

print(f"Checking for {src}...")
if os.path.exists(src):
    print("Found it. Renaming...")
    try:
        os.rename(src, dst)
        print("Success.")
    except Exception as e:
        print(f"Failed: {e}")
else:
    print("Not found.")
    print("Files in folder:")
    for f in os.listdir(folder):
        print(f" - {f}")
