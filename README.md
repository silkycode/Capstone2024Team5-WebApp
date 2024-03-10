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

    `sqlite3 users.db ".read make_userDB.sql"` inside ./database to generate an empty users database that you can fill for dev testing

Have two separate terminals running the Flask server and the vite dev server -- they both need to be running in order to interact (VS code can open multiple terminals)

Current tasks:

    - Registration API endpoint
    - User profile db
    - Product page implementation and dynamic information loading
