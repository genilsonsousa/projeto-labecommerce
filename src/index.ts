import express, { Request, Response } from "express";
import cors from "cors";
import { baseProduct, basePurchase, baseUser } from "./database";
import { CATEGORIAS, Product, Purchase, User } from "./type";
import { db } from "./database/knex";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

//getAllUsers
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`SELECT * FROM users;`);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Error inesperado");
    }
  }
});
//getAllProducts
app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`SELECT * FROM products;`);

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (err instanceof Error) {
      res.send(err.message);
    } else {
      res.send("Error inesperado");
    }
  }
});
//searchProductsByName
app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string;

    if (name !== undefined) {
      if (name.length < 1) {
        res.status(404);
        throw new Error("query params deve possuir pelo menos um caractere");
      }
    }

    const filterProduct = await db.raw(`
    SELECT * FROM products
    WHERE name LIKE "%${name}%";
    `);

    console.log(filterProduct);

    res.status(200).send(filterProduct);
  } catch (err) {
    console.log(err);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (err instanceof Error) {
      res.send(err.message);
    } else {
      res.send("Error inesperado");
    }
  }
});

//createNewUser

app.post("/users", async (req: Request, res: Response) => {
  try {
    const id= req.body.id as string;
    const name = req.body.name as string;
    const email = req.body.email as string;
    const password = req.body.password as string;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Dados invalidos");
    }

    await db.raw(`
    INSERT INTO users(id ,name, email , password)
    VALUES ("${id}","${name}", "${email}", "${password}");
    `);

    res.status(201).send("Cadastro realizado com sucesso");
  } catch (err) {
    console.log(err);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (err instanceof Error) {
      res.send(err.message);
    } else {
      res.send("Error inesperado");
    }
  }
});

//createNewProduct
app.post("/products",async (req: Request, res: Response) => {
  try {
    const id = req.body.id as string;
    const name = req.body.name as string;
    const price = req.body.price as number;
    const description= req.body.description as string;
    const  image_url= req.body.image_url as string

    if(!id || !name || !price || !description || !image_url){
        res.status(404);
      throw new Error("dados invalidos");

    }

    await db.raw(`
    INSERT INTO products (id, name, price, description,image_url)
    VALUES ("${id}", "${name}", "${price}", "${description}", "${image_url}")
    `)
    res.status(201).send("Produto cadastrado com sucesso");
  } catch (err) {
    console.log(err);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (err instanceof Error) {
      res.send(err.message);
    } else {
      res.send("Error inesperado");
    }
  }
});

//createPurchase
app.post("/purchasess",async (req: Request, res: Response) => {
 
    try {
      const id = req.body.id as string;
      const  buyer_id = req.body.buyer_id as string;
      const total_price = req.body.total_price as number;
      const paid = req.body.paid as number;
  
      if (!id || !buyer_id || !total_price) {
        throw new Error("Dados invalidos.");
      }
  
      await db.raw(`
        INSERT INTO purchases(id,  buyer_id, total_price, paid)
        VALUES("${id}","${ buyer_id}","${total_price}","${paid}");
      `)
      
      res.status(201).send("Compra realizada com sucesso!");
  } catch (err) {
    console.log(err);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (err instanceof Error) {
      res.send(err.message);
    } else {
      res.send("Error inesperado");
    }
  }
});

//  -----------APROFUNDANDO-EXPRESS

// Get Products by id
app.get("/products/:id", async(req: Request, res: Response) => {
  try {
    const idToProduct = req.params.id as string;

    if (!idToProduct){
        res.status(404);
        throw new Error("produto não encontrado")
      }
  
      const produto= await db.raw(`
      SELECT * FROM products 
      WHERE id = "${idToProduct}";
      
      `)

      res.status(200).send(produto)
   

    }catch (err) {
      console.log(err);
      if (res.statusCode === 200) {
        res.status(500);
      }
  
      if (err instanceof Error) {
        res.send(err.message);
      } else {
        res.send("Error inesperado");
      }
  }
});

// Get User Purchases by User id
app.get("/users/:id/purchases",async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if(!id){
      res.status(404);
      throw new Error("compra não encontrada")
    }

    const purchase= await db.raw(`
     SELECT * FROM  purchasess
     WHERE id="${id}";
    `)

    res.status(200).send(purchase)

  
  } catch (err) {
    console.log(err);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (err instanceof Error) {
      res.send(err.message);
    } else {
      res.send("Error inesperado");
    }
  }
});

// Delete User by id
app.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!baseUser.some((p) => p.id === id)) {
      res.status(404);
      throw new Error("Conta nao encontrada");
    }

    const indexToId = baseUser.findIndex((user) => {
      return user.id === id;
    });

    if (indexToId >= 0) {
      baseUser.splice(indexToId, 1);
    }

    res.status(200).send("Usuario deletado com sucesso");
  } catch (error) {
    res.send(error.message);
  }
});

app.delete("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!baseProduct.some((p) => p.id === id)) {
      res.status(404);
      throw new Error("Conta nao encontrada");
    }

    const productDelete = baseProduct.findIndex((product) => {
      return product.id === id;
    });

    if (productDelete > 0) {
      baseProduct.splice(productDelete, 1);
    }

    res.status(200).send("item deletado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// Edit User by id
app.put("/users/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!baseUser.some((user) => user.id === id)) {
      res.status(404);
      throw new Error("User não encontrado");
    }

    const newEmail = (req.body.email as string) || undefined;
    const newPassword = (req.body.password as string) || undefined;

    if (newPassword !== undefined) {
      if (newPassword.length < 8) {
        res.status(404);
        throw new Error("Senha deve conter no minimo 8 caracteres");
      }
    }

    if (newEmail !== undefined) {
      if (!newEmail.includes("@")) {
        res.status(404);
        throw new Error("Email deve conter @");
      }
    }

    const user = baseUser.find((user) => user.id === id);

    if (user) {
      user.email = newEmail || user.email;
      user.password = newPassword || user.password;
      res.status(200).send("Atualizaça Realizada");
    } else {
      res.status(400).send("Usuario não encontrado");
    }
  } catch (err) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(err.message);
  }
});

// Edit Product by id
app.put("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!baseProduct.some((p) => p.id === id)) {
      res.status(404);
      throw new Error("User não encontrado");
    }

    const newName = (req.body.name as string) || undefined;
    const newPrice = (req.body.price as number) || undefined;

    if (newPrice !== undefined) {
      if (newPrice < 0) {
        res.status(404);
        throw new Error("price deve ser maior que 0");
      }
    }

    if (newName !== undefined) {
      if (newName.length < 2) {
        res.status(404);
        throw new Error("Name deve conter mais caracteres");
      }
    }

    const product = baseProduct.find((p) => p.id === id);

    if (product) {
      product.name = newName || product.name;
      product.price = isNaN(newPrice) ? product.price : newPrice;
      res.status(200).send("Atualizaça Realizada");
    } else {
      res.status(400).send("Usuario não encontrado");
    }
  } catch (err) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(err.message);
  }
});
