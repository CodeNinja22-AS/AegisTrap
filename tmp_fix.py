import csv

with open('backend/ml/ml_training/dataset.csv', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

data = []
for i, line in enumerate(lines):
    if i == 0 or not line.strip():
        # Keep header as is
        pass
    else:
        # We manually split by the LAST comma, unescape if poorly escaped, and re-escape.
        # Actually, let's just strip leading/trailing double quotes if they were added in the last step,
        # then write via csv writer.
        pass

# Let's clean the file by hand for the specific line 25 if possible, or just properly parse and rewrite.
# Actually, the original issue was that SOME lines had real commas before the label.
# Let's strip quotes if they were added by the last script:
import re
new_data = []

with open('backend/ml/ml_training/dataset.csv', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

for i, line in enumerate(lines):
    if i == 0 or not line.strip():
        new_data.append(line)
        continue
        
    idx = line.rfind(',')
    if idx == -1:
        new_data.append(line)
        continue
        
    inp = line[:idx]
    label = line[idx+1:]
    
    # if inp was quoted by the previous script, unquote it
    if inp.startswith('"') and len(inp) >= 2 and inp.endswith('"'):
        # Only unquote if it looks like it was fully quoted by us
        # But wait, we replaced " with "" everywhere. Let's reverse it.
        inp = inp[1:-1]
        inp = inp.replace('\"\"', '\"')
        
    new_data.append([inp, label])

with open('backend/ml/ml_training/dataset.csv', 'w', encoding='utf-8', newline='') as f:
    f.write(new_data[0] + '\n')
    writer = csv.writer(f)
    for row in new_data[1:]:
        writer.writerow(row)
