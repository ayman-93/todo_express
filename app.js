import express from 'express';
import bodyParser from 'body-parser';
import db from './db/db';

// const db =  require('./db/db');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.put('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let todoFound;
    let itenIndex;
    db.map((todo,index) => {
        if(todo.id === id){
            todoFound = todo;
            itenIndex = index;
        }
    });
    
    if(!todoFound){
        return res.status(404).send({
            success: 'false',
            message: 'todo not found',
        });
    }
    if(!req.body.title){
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    }else if(!req.body.description){
        return res.status(400).send({
          success: "false",
          message: "description is required"
        });
    }

    const updateTodo = {
        id: todoFound.id,
        title: req.body.title || todoFound.title,
        description: req.body.description || todoFound.description,
    };

    db.splice(itenIndex, 1, updateTodo);
    
    return res.status(201).send({
        success: 'true',
        message: 'todo updated successfuly',
        updateTodo
    });
});

app.delete('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // for(let todo of db){
    //     if(todo.id == id){
    //         const index = db.indexOf(todo);
    //         db.splice(index,1)
    //         return res.status(201).send({
    //             success: 'true',
    //             message: `todo with id:${id} deleted`,
    //             db
    //         });
    //     }
    // }
    db.map((todo, index) => {
        if(todo.id === id){
            db.splice(index,1);
            return res.status(200).send({
                success: 'true',
                message: 'Todo deleted successfuly',
            });
        }
    });

    return res.status(404).send({
        success: 'false',
        message: 'todo not found',
    });
})

app.get('/api/v1/todos/:id', (req, res) => {
    // const id = req.params.id;
    // for(let ids of db){
    //     if(ids.id == id)
    //         return res.status(200).send({
    //             db: ids
    //         })
    // }
    const id = parseInt(req.params.id);
    db.map((todo) => {
        if(todo.id == id)
        return res.status(200).send({
            success: "true",
            message: 'todo retrieved successfully',
            todo,
        })
    })
})

app.post('/api/v1/todos', (req, res) => {
    if(!req.body.title){
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    } else if(!req.body.description){
        return res.status(400).send({
            success: 'false',
            message: 'description is required'
        });
    }
    const todo = {
        id: db.length + 1,
        title: req.body.title,
        description: req.body.description
    }

    db.push(todo);
    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        todo
    })
});

app.get('/api/v1/todos', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'todos retrieved successfully',
        todos: db
    })
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    
});