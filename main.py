from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="SmartTend")

STATIC_DIR = os.path.join(os.path.dirname(__file__), "app", "static")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
async def root():
    return FileResponse(os.path.join(STATIC_DIR, "login.html"))


@app.get("/login.html")
async def login_page():
    return FileResponse(os.path.join(STATIC_DIR, "login.html"))


@app.get("/enrollment.html")
async def enrollment_page():
    return FileResponse(os.path.join(STATIC_DIR, "enrollment.html"))


@app.get("/admin")
async def admin_page():
    return FileResponse(os.path.join(STATIC_DIR, "admin", "page.html"))


@app.get("/lecturer")
async def lecturer_page():
    return FileResponse(os.path.join(STATIC_DIR, "lecturer", "page.html"))


@app.get("/student")
async def student_page():
    return FileResponse(os.path.join(STATIC_DIR, "student", "page.html"))
