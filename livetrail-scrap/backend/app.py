
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from services.scrap import get_race_time, get_races, get_race_by_id

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def race(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"races": get_races()}
    )

@app.get("/race/{id}", response_class=HTMLResponse)
async def race(request: Request, id: str):
    return templates.TemplateResponse(
        request=request, name="race.html", context={"data": get_race_by_id(id)}
    )

@app.get("/race/{id}/{goal}", response_class=HTMLResponse)
async def race(request: Request, id: str, goal: str = '10:30', speed: int = 0):
    return templates.TemplateResponse(
        request=request, name="race.html", context={"data": get_race_time(id, goal)}
    )