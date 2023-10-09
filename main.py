import requests
import pandas as pd
import json
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount a directory for serving static files (CSS and JS)
app.mount("/static", StaticFiles(directory="static"), name="static")
topics = ['Data Types and Variables ',
          'Operators',
          'Conditional Controls',
          'Loops',
          'Big-O Notation',
          'Arrays (1D, 2D, and more)',
          'Strings',
          'Pointers',
          'Dynamic Memory Allocation',
          'Functions, Parameters, Return Types',
          'Command Line Arguments, Pointer to Functions',
          'Recursive Functions',
          'Macros, Structures, and Unions',
          'File Handling',
          'Divide and Conquer',
          'Dynamic Programming',
          'Backtracking, Branch and Bound',
          'Search and Sort',
          'String Matching',
          'Matrix and Vector Operations',
          'Linked List',
          'Queue/Stack',
          'Expression Evaluation',
          'Trees',
          'Graph Algorithms']


@app.get("/", response_class=HTMLResponse)
async def get_index():
    url = 'https://docs.google.com/spreadsheets/d/1mCtTAk-jOxM-nSbnlC26EzQ33DP5GXyMCshPZF5DU7s/export?format=csv'
    response = requests.get(url)
    with open('file.csv', 'wb') as file:
        file.write(response.content)
    df = pd.read_csv('file.csv',skiprows=3).rename(columns={"Unnamed: 0": "Name", "Unnamed: 1": "Topics", "Unnamed: 2": "State", "Unnamed: 3": "Link"})
    data = [{'Name':df['Name'][i],
        'Topics':[x.strip() for x in df['Topics'][i].split(', ')],
        'State': df['State'][i],
        'Link' : df['Link'][i]     
        } for i in range(len(df))]
    out_file = open("./static/js/data.json", "w")
    json.dump(data, out_file, indent = 6)
    out_file.close() 
    with open("templates/index.html", "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)

@app.get("/Topics")
async def get_Topics():

    return json.load(open('./static/js/data.json'))


