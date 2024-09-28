// Устанавливаем зависимости
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const port = 5000;
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_CODE = "some codes";

app.use(cors());
app.use(express.json());

// Подключаемся к бз
const db = new sqlite3.Database("UserData.db", (err) => {
  if (err) {
    console.log("Приозошла ошибка", err.message);
  }
  console.log("Успешно подключились к базе данных");
});

// Создаем таблицу

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
    );
`;

const createRecipeTable = `
      CREATE TABLE IF NOT EXISTS recipe(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL
      );
`;


// Передаем таблицу чтобы оно создалась
db.run(createTableQuery, (err) => {
  if (err) {
    console.log("Произошла ошибка при создании таблицы", err.message);
  }
  console.log("Таблица успешно создана");
});

db.run(createRecipeTable,(err)=>{
  if(err){
    console.log("Произошла ошибка при создании таблицы",err.message)
  }
  console.log("Таблица упешно создана")
})


// Регистрация нового пользователя

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({ error: "Почта или пароль обязателен" });
  }
  // Хэшируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);
  const insertQuery = "INSERT INTO users(email,password) VALUES(?,?)";

  // Передаем данные в таблицу
  db.run(insertQuery, [email, hashedPassword], function (err) {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});


app.post("/recipe",async(req,res)=>{
  const {foodName, description} = req.body;
  if(!foodName){
    return res.status(500).json({error:"Имя отсутствует"})
  }
  if(!description){
    return res.status(500).json({error:"Описания отсутствует"})
  }

  const insertQuery = "INSERT INTO recipe(name,description) VALUES(?,?)"

  db.run(insertQuery,[foodName,description],function(err){
    if(err){
      return res.status(401).json({error:err.message})
    }
    res.json({id:this.lastID})
  })
})


// Для получение чего либо с помощью токена 
const authentification = (req,res,next)=>{
  const authHeader = req.headers["authorization"]
  if(!authHeader){
    return res.status(401).json({error:"Authentification's header is missing"})
  }
  const token = authHeader.split(" ")[1]
  if(!token){
    return res.status(401).json({error:"Токен не существует"})
  }

  jwt.verify(token,SECRET_CODE,(err,user)=>{
    if(err){
      return res.status(401).json({error:err.message})
    }
    req.user = user;
    next()
  });
};




// Вход пользователя
app.post("/logIn", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: "Пароль или эмейл не совпадает" });
  }

  const query = "SELECT * FROM users WHERE email =?";
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: "Юзера не существует" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(401).json({ error: "Пароль не совпдает" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_CODE, {
      expiresIn: "1h",
    });
    res.json({ token });
  });
});


// Получаем почту юзер'а
app.get('/email',authentification,(req,res)=>{
  const email = req.user.email
  const query = "SELECT email FROM users WHERE email = ?";

  db.all(query,[email],(err,rows)=>{
    if(err){
      return res.status(401).json({error:err.message})
    }
    if(!rows){
      return res.status(401).json({error:"Юзер не найден"})
    }
    res.json(rows)
  })
})



app.get('/recipes',authentification,(req,res)=>{
  const userId = req.query.id
  const query = "SELECT id,description,name FROM recipe"

  db.all(query,[userId],(err,rows)=>{
    if(err){
      return res.status(401).json({error:err.message})
    }
    if(rows.length === 0){
      return res.status(401).json({error:"Юзер нет"})
    }
    res.json(rows)
  })
})


app.listen(port, () => {
  console.log("Сервер работает на порте ", port);
});


