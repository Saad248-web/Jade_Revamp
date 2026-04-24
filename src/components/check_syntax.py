
import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    braces = 0
    curlies = 0
    squares = 0
    
    for i, char in enumerate(content):
        if char == '{': curlies += 1
        elif char == '}': curlies -= 1
        elif char == '(': braces += 1
        elif char == ')': braces -= 1
        elif char == '[': squares += 1
        elif char == ']': squares -= 1
        
        if curlies < 0:
            line = content.count('\n', 0, i) + 1
            print(f"Unbalanced curly at line {line}")
            curlies = 0
        if braces < 0:
            line = content.count('\n', 0, i) + 1
            print(f"Unbalanced brace at line {line}")
            braces = 0

    print(f"Final counts: curly={curlies}, brace={braces}, square={squares}")

if __name__ == '__main__':
    check_balance(sys.argv[1])
