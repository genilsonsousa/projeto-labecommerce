import express, {Request, Response} from "express"
import cors from 'cors'
import { baseProduct, basePurchase, baseUser } from "./database"
import { CATEGORIAS, Product, Purchase, User } from "./type"


const app = express()

app.use(express.json())
app.use(cors())



app.listen(3003,()=>{
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res:Response)=>{
    res.send("Pong!")
})

//getAllUsers
app.get('/users', (req:Request, res:Response)=>{
   try{
    res.status(200).send(baseUser)
   }catch(error){
   console.log(error)
   res.status(500)
   }
 })
 //getAllProducts
 app.get('/products', (req:Request, res:Response)=>{

    try{
        res.status(200).send(baseProduct)
  

    }catch(err){
        res.status(404).send(err.message)
    }



  })
 //searchProductsByName
  app.get('/products/search', (req:Request, res:Response)=>{

    try{
        const q= req.query.name as string
        const filterProduct= baseProduct.filter((product)=>{
            return product.name.includes(q)
           })
    
        // query params deve possuir pelo menos um caractere
       
    if(q.length < 1){
        res.status(404)
        throw new Error ("query params deve possuir pelo menos um caractere")
    }

    if(filterProduct.length < 1){
        res.status(404)
        throw new Error ("Não encontrado")

    }

    
     res.status(200).send(filterProduct)

    }catch(err){
        if (res.statusCode===200){
                        res.status(500)
                      }
                    
                      res.send(err.message)
            
    }

})


  //createNewUser

  app.post('/users', (req:Request, res:Response)=>{
  
try{
    const id= req.body.id as string
    const email= req.body.email as string
    const password= req.body.password as string
    
    // validar email
    if(baseUser.some((user)=> user.email === email)){
        res.status(404);
        throw new Error("Email já castrado")

    }
    //  validar id
    if(baseUser.some((user)=> user.id === id)){
        res.status(404);
        throw new Error("id ja existe")

    }

    // validar senha
    if (password.length < 8){
        res.status(404)
        throw new Error("Senha deve conter no minimo 8 caracteres")
    }
    const newUers: User={
        id,
        email,
        password
    }

    baseUser.push(newUers)
    res.status(201).send("Cadastro realizado com sucesso")

}catch(error){
    res.send(error.message)

}
 })

 //createNewProduct
 app.post('/products', (req:Request ,res:Response)=>{
   
    try{
        const id = req.body.id as string;
    const name = req.body.name as string;
    const price = req.body.price as number;
    const category = req.body.category as CATEGORIAS;
    
    if(baseProduct.some((product)=> product.id=== id)){
        res.status(404);
        throw new Error("Id de produto ja existe. tente outro id")
    }

    if(name.length <2){
        res.status(404);
        throw new Error("Nome precisa ter mais de 2 catacteres")

    }

    if (price !== undefined){
        if(price <0){
            res.status(404)
            throw new Error("Valor do produto deve ser maior que 0")

        }
    } 
    
    const newPrice: Product={

        id,
        name,
        price,
        category
    }
     baseProduct.push(newPrice)
    res.status(201).send("Produto cadastrado com sucesso")
    } catch(error){
        res.send(error.message)

    }
 })

 //createPurchase
 app.post('/purchases', (req:Request, res:Response)=>{
try{
        // const body= req.body
        const userId = req.body.userId as string;
        const productId = req.body.productId as string;
        const quantity = req.body.quantity as number;
        const totalPrice = req.body.totalPrice as any;
    
        // validar body
        if(basePurchase.some((purchase)=> purchase.userId === userId)){
            res.status(404);
            throw new Error("id de usuario ja existe nas compras")
        }

        if(basePurchase.some((purchase)=> purchase.productId === productId)){
            res.status(404);
            throw new Error("id de produto ja existe nas compras")
        }



        const newPurchases: Purchase={
            userId,
            productId,
            quantity,
            totalPrice
        }
    
       basePurchase.push(newPurchases)
        res.status(201).send("Compra cadastrada com sucesso")
}catch(error){
    res.send(error.message)

}
 })

 //  -----------APROFUNDANDO-EXPRESS



// Get Products by id
app.get("/products/:id" , (req:Request, res:Response)=>{

    try{
        const id= req.params.id as string
    
       

        if(!baseProduct.some((p)=> p.id === id)){
                res.status(404);
                throw new Error("produto nao encontrado")
        
            }

            const indexToId= baseProduct.find((product)=>{
                return product.id === id
            })

            if(indexToId){
               const productReturn= baseProduct.filter((produto)=>produto.id ===id)
               res.status(200).send(productReturn)
        
            }

    
    }catch(error){
        res.send(error.message)
    
    }
     })


// Get User Purchases by User id
app.get("/users/:id/purchases" , (req:Request, res:Response)=>{

    try{
        const id= req.params.id as string
    
       

        if(!basePurchase.some((p)=> p.userId === id)){
                res.status(404);
                throw new Error("produto nao encontrado")
        
            }

            const indexToId= basePurchase.find((product)=>{
                return product.userId === id
            })

            if(indexToId){
               const productReturn= basePurchase.filter((produto)=>produto.userId ===id)
               res.status(200).send(productReturn)
        
            }

    
    }catch(error){
        res.send(error.message)
    
    }
     })



// Delete User by id
app.delete("/users/:id", (req:Request, res:Response)=>{
    try{
        const id= req.params.id as string
    
       

        if(!baseUser.some((p)=> p.id === id)){
                res.status(404);
                throw new Error("Conta nao encontrada")
        
            }

            const indexToId= baseUser.findIndex((user)=>{
                return user.id === id
            })

            if(indexToId >=0){
              baseUser.splice(indexToId,1)
              
        
            }

            res.status(200).send("Usuario deletado com sucesso")

    
    }catch(error){
        res.send(error.message)
    
    }

})

app.delete("/products/:id", (req:Request, res:Response)=>{
    try{
        const id= req.params.id 


        if(!baseProduct.some((p)=>p.id === id)){
                res.status(404);
                throw new Error("Conta nao encontrada")
        
            }

            const productDelete= baseProduct.findIndex((product)=>{
                return product.id === id
            })

         if(productDelete >0){
            baseProduct.splice(productDelete, 1)
         }   

            res.status(200).send("item deletado com sucesso")

           

    
    }catch(error){
        if(res.statusCode===200){
            res.status(500)
        }
        res.send(error.message)
    
    }

})

// Edit User by id
app.put('/users/:id' , (req: Request, res: Response)=>{
  try{
    const id= req.params.id as string

    if(!baseUser.some((user)=> user.id===id)){
        res.status(404)
        throw new Error ("User não encontrado")

    }

    const newEmail= req.body.email as string || undefined
    const newPassword= req.body.password as string || undefined

    if(newPassword !== undefined){
       if(newPassword.length <8){
        res.status(404)
        throw new Error ("Senha deve conter no minimo 8 caracteres")
       } 
    }

    if(newEmail !== undefined){
        if(!newEmail.includes("@")){
         res.status(404)
         throw new Error ("Email deve conter @")
        } 
     }

     const user= baseUser.find((user)=> user.id === id)

     if(user){

        user.email= newEmail || user.email
        user.password= newPassword || user.password
        res.status(200).send("Atualizaça Realizada")
        
    }else{
        res.status(400).send("Usuario não encontrado")

    }

  }catch(err){
    if(res.statusCode === 200){
        res.status(500)
    }

    res.send(err.message)

  }

})

// Edit Product by id
app.put('/products/:id' , (req: Request, res: Response)=>{
    try{
        const id= req.params.id as string
    
        if(!baseProduct.some((p)=> p.id===id)){
            res.status(404)
            throw new Error ("User não encontrado")
    
        }
    
        const newName= req.body.name as string || undefined
        const newPrice= req.body.price as number || undefined
    
        if(newPrice !== undefined){
           if(newPrice <0){
            res.status(404)
            throw new Error ("price deve ser maior que 0")
           } 
        }
    
        if(newName !== undefined){
            if(newName.length < 2){
             res.status(404)
             throw new Error ("Name deve conter mais caracteres")
            } 
         }
    
         const product= baseProduct.find((p)=> p.id === id)
    
         if(product){
    
            product.name= newName || product.name
            product.price= isNaN (newPrice) ?  product.price : newPrice
            res.status(200).send("Atualizaça Realizada")
            
        }else{
            res.status(400).send("Usuario não encontrado")
    
        }
    
      }catch(err){
        if(res.statusCode === 200){
            res.status(500)
        }
    
        res.send(err.message)
    
      }
   

})


