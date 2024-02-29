For Flask:

    create a virtual environment (assuming you have Python installed):
        `python -m venv venv`
    Activate the virtual environment:
        On Windows: `venv\Scripts\activate`
        On Unix or MacOS: `source venv/bin/activate`
    Install dependencies: `pip install -r requirements.txt`
    Run server: python app.py
    Deactive virtual environment with:
        `deactivate`

For node:

    `npm install` after cloning this project to install dependencies (run this while inside the frontend folder)
    `npm run dev` inside ./frontend to start vite development server

For database things:

    `sqlite3 users.db ".read make_userDB.sql"` inside ./database to generate an empty users database that you can fill for dev testing

Current tasks:

    Continue migrating HTML and JS to React components
        Registration form
        Remember to add routing for new page states (like new pages)
    Extend tables within users.db to have more page things like glucose logs, product information
    Write more API responses in Flask for other database interactions
        Flesh out security of username/password validation
