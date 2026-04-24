
import sys
import re

def count_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    opens = re.findall(r'<([a-zA-Z0-9\.]+)(?:\s|>)', content)
    closes = re.findall(r'</([a-zA-Z0-9\.]+)>', content)
    self_closes = re.findall(r'<[a-zA-Z0-9\.]+(?:\s[^>]*|)/?>', content)
    
    open_counts = {}
    for tag in opens:
        open_counts[tag] = open_counts.get(tag, 0) + 1
        
    close_counts = {}
    for tag in closes:
        close_counts[tag] = close_counts.get(tag, 0) + 1

    # Filter out self-closing tags from opens (roughly)
    # This is a bit simplified but good enough
    
    print("Open Tags:", open_counts)
    print("Close Tags:", close_counts)

if __name__ == '__main__':
    count_tags(sys.argv[1])
