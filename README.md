For Flask:

    create a virtual environment (assuming you have Python installed):
        `python -m venv venv`
    Activate the virtual environment:
        On Windows: `.\venv\Scripts\activate`
        On Unix or MacOS: `source venv/bin/activate`
    Install dependencies: `pip install -r requirements.txt`
    Run server: `python app.py`
    Deactive virtual environment with:
        `deactivate`

For node:

    `npm install` after cloning this project to install dependencies (run this while inside the frontend folder)
    `npm run dev` inside ./frontend to start vite development server

For database things:

    `sqlite3`
    `sqlite3 .read debug_user_managementDB.sql`

    Run these inside ./database to generate a dummy users database that you can use for testing

Have two separate terminals running the Flask server and the vite dev server -- they both need to be running in order to interact (VS code can open multiple terminals)

Current tasks:

    - Dashboard implementation
    - Filling out user profile options
    - Product page implementation and dynamic information loading
