# pythonified version of create_db.sh included in usda-sqlite
# credit: https://github.com/alyssaq/usda-sqlite
# 2015 data

# original code
# --------------

# #!/bin/bash

# if [ $# -ne 1 ]
# then
#   echo "You must specify a sqlite file as an argument."
#   exit 1
# fi

# echo "Normalizing data..."
# # Remove tildas
# perl -pi -e s,~,,g data/*.txt
# # Replace micro symbol to ASCII
# perl -C1 -i -pe 's/\x{00B5}/mc/' data/NUTR_DEF.txt

# echo "Loading food group..."
# sqlite3 $1 < load_food_group.sql

# echo "Loading food..."
# sqlite3 $1 < load_food.sql

# echo "Loading nutrient..."
# sqlite3 $1 < load_nutrient.sql
# sqlite3 $1 < load_common_nutrient.sql

# echo "Loading nutrition..."
# sqlite3 $1 < load_nutrition.sql

# echo "Loading weight..."
# sqlite3 $1 < load_weight.sql

# echo "Done."

import os
import subprocess
import sys

def normalize_data():
    print("Normalizing data...")
    files_to_normalize = ["data/NUTR_DEF.txt"]
    for file_path in files_to_normalize:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
            data = file.read()
        data = data.replace("~", "")
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(data)
    replace_micro_symbol("data/NUTR_DEF.txt")

def replace_micro_symbol(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
        data = file.read()
    data = data.replace("µ", "mc")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(data)

def load_data(sqlite_file):
    print("Loading data...")
    subprocess.run(["sqlite3", sqlite_file], input=open("load_food_group.sql", "r").read(), text=True, check=True)
    subprocess.run(["sqlite3", sqlite_file], input=open("load_food.sql", "r").read(), text=True, check=True)
    subprocess.run(["sqlite3", sqlite_file], input=open("load_nutrient.sql", "r").read(), text=True, check=True)
    subprocess.run(["sqlite3", sqlite_file], input=open("load_common_nutrient.sql", "r").read(), text=True, check=True)
    subprocess.run(["sqlite3", sqlite_file], input=open("load_nutrition.sql", "r").read(), text=True, check=True)
    subprocess.run(["sqlite3", sqlite_file], input=open("load_weight.sql", "r").read(), text=True, check=True)
    print("-- food db created and populated --")

def create_database(sqlite_file):
    if not os.path.exists(sqlite_file):
        print(f"Creating SQLite database: {sqlite_file}")
        open(sqlite_file, 'a').close()
        print("Database created.")

def main():
    if len(sys.argv) < 2:
        print("Usage: python create_db.py <sqlite_file>")
        sys.exit(1)
    
    sqlite_file = sys.argv[1]
    
    create_database(sqlite_file)
    normalize_data()
    load_data(sqlite_file)

if __name__ == "__main__":
    main()