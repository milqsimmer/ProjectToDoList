# My To Do List

Aplicação simples de lista de tarefas construída com Next.js e Chakra UI no front-end e FastAPI e PostgreSQL no back-end. A aplicação permite que você crie, edite, visualize e exclua tarefas.

### Pré-requisitos

- Node.js
- npm
- Python 3
- PostgreSQL

### Como rodar o app

**Repositório:**

```bash
git clone https://github.com/milqsimmer/ProjectToDoList.git
cd ProjectToDoList
```

**Backend**

- criar banco de dados postgres
- table:
  ```
  -- Table: public.tasks
  
  -- DROP TABLE IF EXISTS public.tasks;
  
  CREATE TABLE IF NOT EXISTS public.tasks
  (
      id integer NOT NULL DEFAULT nextval('tasks_id_seq'::regclass),
      title character varying(255) COLLATE pg_catalog."default" NOT NULL,
      description character varying(255) COLLATE pg_catalog."default" NOT NULL,
      status character varying(10) COLLATE pg_catalog."default" NOT NULL DEFAULT 'to do'::character varying,
      CONSTRAINT tasks_pkey PRIMARY KEY (id),
      CONSTRAINT "check-status" CHECK (status::text = ANY (ARRAY['to do'::character varying, 'done'::character varying]::text[])) NOT VALID
  )
  
  TABLESPACE pg_default;
  
  ALTER TABLE IF EXISTS public.tasks
      OWNER to postgres;
  ```


- rodar app backend:

  ```bash
  cd backend-todo-list
  python main.py
  ```

- checar Apis:
  > http://localhost:8000/docs#/
 ou no cmd:
  > ler tasks
  ```
  curl -X GET "http://localhost:8000/tasks"
  ```
  > criar tasks
  ```
  curl -X POST "http://localhost:8000/tasks" \
     -H "Content-Type: application/json" \
     -d '{"title": "Comprar comida", "description": "maça, frango e pão"}'

  ```
  > editar tasks
  ```
  curl -X PUT "http://localhost:8000/tasks/1" \
     -H "Content-Type: application/json" \
     -d '{"title": "Comprar comida", "description": "maça, frango e pão", "status": "done"}'
  ```
  >  deletar tasks
  ```
  curl -X DELETE "http://localhost:8000/tasks/1"

  ```

  ** Frontend **
  ```
  cd todo-list
  npm init
  npm dev run

  ```
