
import os
import shutil

src = r"c:\Users\Admin\Desktop\Jade_ReVamp\public\Villa_Retreats\Jade 735\Hero\.webp"
dst = r"c:\Users\Admin\Desktop\Jade_ReVamp\public\Villa_Retreats\Jade 735\Hero\Villa_Landscape.webp"

if os.path.exists(src):
    try:
        os.rename(src, dst)
        print(f"Successfully renamed {src} to {dst}")
    except Exception as e:
        print(f"Error renaming: {e}")
else:
    print(f"Source file {src} not found")
