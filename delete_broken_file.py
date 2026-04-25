
import os
path = r"c:\Users\Admin\Desktop\Jade_ReVamp\public\Villa_Retreats\Jade 735\Hero\.webp"
if os.path.exists(path):
    os.remove(path)
    print(f"Deleted {path}")
else:
    print(f"File {path} does not exist")
