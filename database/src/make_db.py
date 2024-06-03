import subprocess

def run_script(script_path, args=None):
    if args is None:
        args = []
    try:
        subprocess.run(['python', script_path] + args, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running script: {e}")

if __name__ == "__main__":
    user_path = 'user_load.py'
    product_path = 'product_load.py'
    food_path = 'food_load.py'

    print(f"Running {user_path}...")
    run_script(user_path)

    print(f"Running {product_path}...")
    run_script(product_path)

    # print(f"Running {food_path}...")
    # run_script(food_path, ["usdafood.db"])

    print("All scripts have finished running.")