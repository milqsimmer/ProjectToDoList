from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:8000",  # FastAPI server (if you need to allow requests to itself)
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurações do banco de dados
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "12345"

# Função para obter conexão com o banco de dados
def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn

@app.get("/tasks")
def get_tasks():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM tasks;")
        tasks = cur.fetchall()
        cur.close()
        conn.close()
        return {"tasks":[{"id": task[0], "title": task[1], "description": task[2], "status": task[3]} for task in tasks]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks")
def create_task(title:str, description:str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO tasks (title, description) VALUES (%s, %s) RETURNING id;",
            (title, description)
        )
        task_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {"id": task_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.put("/tasks/{task_id}")
def update_task(task_id:int, title: str, description: str, status:str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE tasks SET title = %s, description = %s, status = %s WHERE id = %s RETURNING id;",
            (title, description, status, task_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"id": task_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM tasks WHERE id = %s RETURNING id;", (task_id,))
        deleted_task_id = cur.fetchone()
        if deleted_task_id is None:
            raise HTTPException(status_code=404, detail="Task not found")
        conn.commit()
        cur.close()
        conn.close()
        return {"id": deleted_task_id[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")