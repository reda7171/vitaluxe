import os
import re

root_dir = r"c:\Users\HP\Desktop\vitaluxe-web"

def get_relative_path(from_file, to_alias_path):
    # alias like @/lib/utils -> ./lib/utils
    alias_target = to_alias_path.replace("@/", "./")
    
    # Absolute paths
    abs_from = os.path.abspath(from_file)
    from_dir = os.path.dirname(abs_from)
    abs_to = os.path.abspath(os.path.join(root_dir, alias_target))
    
    rel_path = os.path.relpath(abs_to, from_dir).replace("\\", "/")
    if not rel_path.startswith("."):
        rel_path = "./" + rel_path
    return rel_path

def process_file(file_path):
    if not file_path.endswith((".ts", ".tsx")):
        return
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    # Regex to find imports with @/, including dynamic imports
    pattern = r'(["\'])(@/[^"\']+)(["\'])'
    
    matches = re.findall(pattern, content)
    if not matches:
        return
    
    for quote_start, alias_path, quote_end in matches:
        rel_path = get_relative_path(file_path, alias_path)
        # We need to be careful not to replace something that isn't an import path, 
        # but in this project @/ is exclusively for path aliases.
        old_str = f"{quote_start}{alias_path}{quote_end}"
        new_str = f"{quote_start}{rel_path}{quote_end}"
        new_content = new_content.replace(old_str, new_str)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

for root, dirs, files in os.walk(root_dir):
    if ".next" in root or "node_modules" in root or ".git" in root:
        continue
    for file in files:
        process_file(os.path.join(root, file))
