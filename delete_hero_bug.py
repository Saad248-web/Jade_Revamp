
import os
path = r"c:\Users\Admin\Desktop\Jade_ReVamp\public\Villa_Retreats\Jade 735\Hero\.webp"
if os.path.exists(path):
    try:
        os.remove(path)
        print(f"Successfully deleted {path}")
    except Exception as e:
        print(f"Error deleting: {e}")
else:
    print(f"File {path} not found")
