
import re

file_path = r"c:/Users/pedro/Downloads/App orações católicas/backend/prisma/seed_catholic.js"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

balance = 0
stack = []

for i, line in enumerate(lines):
    for char in line:
        if char == '{':
            balance += 1
            stack.append(i + 1)
        elif char == '}':
            balance -= 1
            if stack:
                stack.pop()

print(f"Final Balance: {balance}")
if balance > 0:
    print(f"Unclosed braces starting at lines: {stack[:5]}... (Total {len(stack)})")
elif balance < 0:
    print("Too many closing braces!")
