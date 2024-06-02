For Flask:

    create a virtual environment:
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

    in database/src:
    `python make_db.py` to generate and populate food, user, and product DBs

Have two separate terminals running the Flask server and the vite dev server -- they both need to be running in order to interact (VS code can open multiple terminals)

Time format for DB: YYYY:MM:DD HH:MM:SS
