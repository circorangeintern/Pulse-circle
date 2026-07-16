# generate_er_diagram.py
from eralchemy2 import render_er
from app.core.database import engine, Base  
from app.models import User, Company, Job, Review, Report  

if __name__ == "__main__":
    # Generate ER diagram from database schema
    render_er(
        Base,  
        'er_diagram.png'  
    )
    print("ER Diagram generated as 'er_diagram.png'")