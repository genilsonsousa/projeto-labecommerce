import express, { Request, Response } from "express";
import cors from "cors";
import {
  Product,
  Purchase,
  User,
} from "./type";
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
    const result = await db("users");
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
app.get("/purchasess", async (req: Request, res: Response) => {
  try {
    const result = await db("purchasess");
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
    const result = await db("products");
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

    const [filterProduct] = await db("products").where({ name: name });

    if (!name) {
      res.status(404);
      throw new Error("query params deve possuir pelo menos um caractere");
    }

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
    const { id, name, email, password } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (id.length < 4) {
      res.status(400);
      throw new Error("'id' deve possuir pelo menos 4 caracteres");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' deve ser string");
    }

    if (name.length < 2) {
      res.status(400);
      throw new Error("'name' deve possuir pelo menos 2 caracteres");
    }

    if (typeof email !== "string") {
      res.status(400);
      throw new Error("'email' deve ser string");
    }

    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g
      )
    ) {
      throw new Error(
        "'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial"
      );
    }

    const [userIdExist]: User[] | undefined[] = await db("users").where({ id });

    if (userIdExist) {
      res.status(400);
      throw new Error("'id' já existe");
    }
    const [userEmailExist]: User[] | undefined[] = await db("users").where({
      email,
    });

    if (userEmailExist) {
      res.status(400);
      throw new Error("'email' já existe");
    }

    const newUser = {
      id,
      name,
      email,
      password,
    };

    await db("users").insert(newUser);
    res
      .status(201)
      .send({ message: "Cadastro realizado com sucesso", user: newUser });
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
app.post("/products", async (req: Request, res: Response) => {
  try {
    const id = req.body.id as string;
    const name = req.body.name as string;
    const price = req.body.price as number;
    const description = req.body.description as string;
    const image_url = req.body.image_url as string;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (id.length < 4) {
      res.status(400);
      throw new Error("'id' deve possuir pelo menos 4 caracteres");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' deve ser string");
    }

    if (name.length < 2) {
      res.status(400);
      throw new Error("'name' deve possuir pelo menos 2 caracteres");
    }

    if (typeof price !== "number") {
      res.status(400);
      throw new Error("'price' deve ser number");
    }

    if (typeof description !== "string") {
      res.status(400);
      throw new Error("'description' deve ser string");
    }

    if (typeof image_url !== "string") {
      res.status(400);
      throw new Error("'image_url' deve ser string");
    }

    const [productIdExist]: User[] | undefined[] = await db("products").where({
      id,
    });

    if (productIdExist) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newProduct = {
      id,
      name,
      price,
      description,
      image_url,
    };

    await db("products").insert(newProduct);
    res
      .status(201)
      .send({ message: "Cadastro realizado com sucesso", product: newProduct });
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
app.post("/purchasess", async (req: Request, res: Response) => {
  try {
    const id = req.body.id as string;
    const buyer_id = req.body.buyer_id as string;
    const total_price = req.body.total_price as number;
    const paid = req.body.paid as number;
    const create_at = req.body.create_at as string;

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (id.length < 4) {
        res.status(400);
        throw new Error("'id' deve possuir pelo menos 4 caracteres");
      }
    }

    if (buyer_id !== undefined) {
      if (typeof buyer_id !== "string") {
        res.status(400);
        throw new Error("'buyer_id' deve ser string");
      }
    }

    if (total_price !== undefined) {
      if (typeof total_price !== "number") {
        res.status(400);
        throw new Error("'total_price' deve ser number");
      }
    }

    if (paid !== undefined) {
      if (typeof paid !== "number") {
        res.status(400);
        throw new Error("'paid' deve ser number");
      }
    }

    if (create_at !== undefined) {
      if (typeof create_at !== "string") {
        res.status(400);
        throw new Error("'create_at' deve ser string ");
      }
    }

    const [purchaseExist]: Purchase[] | undefined[] = await db(
      "purchasess"
    ).where({ id });

    if (purchaseExist) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newPurchase = {
      id,
      total_price,
      paid,
      buyer_id,
    };

    await db("purchasess").insert(newPurchase);

    const [insertPurchasess]: Purchase[] = await db("purchasess").where({ id });

    res.status(201).send({
      message: "purchases criada com sucesso",
      purchase: insertPurchasess,
    });
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
app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const idToProduct = req.params.id as string;

    if (!idToProduct) {
      res.status(404);
      throw new Error("produto não encontrado");
    }

    const result = await db("products").where({ id: idToProduct });

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

// Get User Purchases by User id
app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (id.length > 2) {
        res.status(400);
        throw new Error("'id' deve ter mais que 2 caracteres");
      }
    }

    const [purchase] = await db("purchasess").where({ buyer_id: id });

    res.status(200).send(purchase);
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
app.delete("/users/:id",async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id as string;
 
    if (idToDelete !== undefined) {
      if (typeof idToDelete !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (idToDelete.length > 2) {
        res.status(400);
        throw new Error("'id' deve ter mais que 2 caracteres");
      }
    }

    const [users]= await db("users").where({id:idToDelete})

    if(!users){
      res.status(404);
      throw new Error("'id' não encontrado");

    }
    await db("purchasess").where({buyer_id:idToDelete }).del()
     await db("users").where({ id: idToDelete }).del()
  
   
    res.status(200).send("user deletado com sucesso")



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

app.delete("/products/:id",async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id as string;
 
    if (idToDelete !== undefined) {
      if (typeof idToDelete !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }
    }

    const [product]= await db("products").where({id:idToDelete})

    if(!product){
      res.status(404);
      throw new Error("'id' não encontrado");

    }

    await db("purchases_products").del().where({product_id:idToDelete })
    await db("products").del().where({ id: idToDelete })
    res.status(200).send("product deletado com sucesso")


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
  }
);

// Edit User by id
app.put("/users/:id",async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id as string;

  const newId= req.body.id;
  const newName= req.body.name;
  const newEmail= req.body.email;
  const newPassword= req.body.id;
  const newCreateAt= req.body.id;


if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (newId.length < 4) {
        res.status(400);
        throw new Error("'id' deve possuir pelo menos 4 caracteres");
      }
    }

if(newName !== undefined){
  if (typeof newName !== "string") {
    res.status(400);
    throw new Error("'name' deve ser string");
  }

  if (newName.length < 2) {
    res.status(400);
    throw new Error("'name' deve possuir pelo menos 2 caracteres");
  }
 }

if(newPassword !== undefined){
  if (
    !newPassword.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g
    )
  ) {
    throw new Error(
      "'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial"
    );
  }
}

if(newEmail !== undefined){
  if (newEmail !== undefined) {
    if (!newEmail.includes("@")) {
      res.status(404);
      throw new Error("Email deve conter @");
    }
  }
}

if(newCreateAt !== undefined){
  if(typeof newCreateAt !== "string"){
   res.status(404);
   throw new Error ("'createAt' deve ser string")
  }
}

const [user]: User[] | undefined[]= await db("users").where({id:idToEdit})

    if (!user) {
      res.status(404);
      throw new Error("'id' não encontrado")
    }


    const newUser: User={
      id: newId || user.id,
      name: newName || user.name,
     email: newEmail || user.email,
      password: newPassword || user.password,
      create_at: newCreateAt || user.create_at,
    }

    await db("users").update(newUser).where({id:idToEdit})
    res.status(200).send({message:" user editado com sucesso", user: newUser})

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

// Edit Product by id
app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const idToProduct = req.params.id as string;

    if (!idToProduct) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const newId = req.body.id as string;
    const newName = req.body.name as string;
    const newPrice = req.body.price as number;
    const newDescription= req.body.description as string;
    const newImageUrl= req.body.image_url as string;

    if (newId !== undefined){
      if(typeof newId !== "string"){
        res.status(404);
        throw new Error ("'id' deve ser string");
      }
      if( newId.length > 1){
        res.status(404);
        throw new Error ("'id' deve ter mais que 1 caracter");
      }
    }

    if (newPrice !== undefined) {
      if (typeof newPrice !== "number") {
        res.status(404);
        throw new Error("'price' deve ser number");
      }
    }

    if (newName !== undefined) {
      if (newName.length < 2) {
        res.status(404);
        throw new Error("Name deve conter mais caracteres");
      }
      if (typeof newName !== "string") {
        res.status(404);
        throw new Error(" 'name' deve ser string");
      }
    }

    if (newDescription !== undefined){
      if(typeof newDescription  !== "string"){
        res.status(404);
        throw new Error ("'newDescription ' deve ser string");
      }
    }

    if (newImageUrl !== undefined){
      if(typeof newImageUrl  !== "string"){
        res.status(404);
        throw new Error ("'newImageUrl ' deve ser string");
      }
    }

    const [product]: Product[] | undefined[]= await db("products").where({id:idToProduct})

    if (!product) {
      res.status(404);
      throw new Error("'id' não encontrado")
    }


    const newProduct: Product={
      id: newId || product.id,
      name: newName || product.name,
      price: newPrice || product.price,
      description: newDescription || product.description,
      image_url: newImageUrl || product.image_url,
    }

    await db("products").update(newProduct).where({id:idToProduct})
    res.status(200).send({message:" product editado com sucesso", user: newProduct})
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

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const idPurchases = req.params.id as string;
    console.log(idPurchases);

    const [filterPurchases] = await db
      .select("*")
      .from("purchasess")
      .where({ id: idPurchases });

    console.log(filterPurchases);

    if (!filterPurchases) {
      res.status(404);
      throw new Error("id não encontrado");
    }

    const purchaseUsers = await db("purchasess")
      .select(
        "purchasess.id AS idDaCompra",
        "purchasess.total_price AS valorDaCompra",
        "purchasess.create_at AS criadaEm",
        "purchasess.paid AS status",
        "users.id AS idDoComprador",
        "users.email AS emailComprador",
        "users.name AS nomeDoComprador"
      )
      //  .from("purchasess")
      .innerJoin("users", "purchasess.buyer_id", "=", "users.id")
      .where({ "purchasess.id": idPurchases });

    const productByPurchases = await db("purchases_products")
      .select(
        "products.id  AS idProduto",
        "products.name AS nomaProduto",
        "products.price AS preçoProduto",
        "products.description ",
        "products.image_url ",
        "purchases_products.quantity"
      )
      .innerJoin(
        "products",
        "purchases_products.product_id",
        "=",
        "products.id"
      )
      .where({ "purchases_products.purchase_id": idPurchases });

    const result = {
      ...purchaseUsers[0],
      paid: purchaseUsers[0].paid === 0 ? false : true,
      productList: productByPurchases,
    };

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

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const idParams = req.params.id;

    const [filterProduct] = await db("products").where({ id: idParams });

    if (!filterProduct) {
      res.status(404);
      throw new Error("id não encontrado");
    }

    const result = await db("purchasess")
      .select(
        "purchasess.id",
        "products.id",
        "products.name",
        "products.description",
        "products.image_url "
      )
      .innerJoin("products", "purchasess.buyer_id", "=", "products.id")
      .where({ "purchasess.id": idParams });

    res.status(200).send(result);
  } catch (err: any) {
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


