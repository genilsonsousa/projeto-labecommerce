import express ,{ Request, Response } from "express"
import cors from 'cors'
import { baseProduct, basePurchase, baseUser } from "./database"
import { Product, Purchase, User } from "./type"

const app = express()

app.use(express.json())
app.use(cors())



app.listen(3003,()=>{
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res:Response)=>{
    res.send("Pong!")
})

// rodar npm run dev

app.get('/users', (req:Request, res:Response)=>{
   res.status(200).send(baseUser)
})

app.get('/baseProduct', (req:Request, res:Response)=>{
    res.status(200).send(baseProduct)
 })

 app.get('/baseProduct/search', (req:Request, res:Response)=>{
// variavel=chave
   const q= req.query.name as string
   const filterProduct= baseProduct.filter((product)=>{
    return product.name.includes(q)
   })
   
   
    res.status(200).send( q? filterProduct: baseProduct)
 })

 app.post('/users', (req:Request, res:Response)=>{
    // const body= req.body
    const {id,email, password}= req.body

    const newUers: User={
        id,
        email,
        password
    }

    baseUser.push(newUers)
    res.status(201).send("Cadastro realizado com sucesso")
 })

 app.post('/baseProduct', (req:Request ,res:Response)=>{
    // const body= req.body
    const{id, name, price,category}=req.body

    const newProduct: Product={

        id,
        name,
        price,
        category
    }
     baseProduct.push(newProduct)
    res.status(201).send("Produto cadastrado com sucesso")
 })

 app.post('/purchases', (req:Request, res:Response)=>{
    // const body= req.body
    const {userId,productId,quantity,totalPrice}= req.body

    const newPurchases: Purchase={
        userId,
        productId,
        quantity,
        totalPrice
    }

   basePurchase.push(newPurchases)
    res.status(201).send("Compra realizada com sucesso")
 })

//  -----------APROFUNDANDO-EXPRESS


app.get("/products/:id" , (req:Request, res:Response)=>{
    const id= req.params.id as string
    
    const indexToId= baseProduct.find((product)=>{
        return product.id === id
    })

    if(indexToId){
        res.status(200).send("objeto product encontrado")
    }
   
})

app.get("/users/:id/purchases" , (req:Request, res:Response)=>{
    const userId= req.params.id as string
    const indexId= basePurchase.find((purchase)=>{
        purchase.userId=== userId
    })

    if(indexId){
        res.status(200).send("array de compras do user procurado")
    }
    

  
})

app.delete("/users/:id", (req:Request, res:Response)=>{
    const id = req.params.id
   

    const indexToRemove= baseUser.findIndex((user)=>{
        return user.id === id
    })

    if (indexToRemove >=0){
        baseUser.splice(indexToRemove,1)

    }

    res.status(200).send("User apagado com sucesso")

})

app.delete("/products/:id", (req:Request, res:Response)=>{
    const id = req.params.id
   

    const indexToRemove= baseProduct.findIndex((product)=>{
        return product.id === id
    })

    if (indexToRemove >=0){
        baseProduct.splice(indexToRemove,1)

    }

    res.status(200).send("Produto apagado com sucesso")

})

app.put('/users/:id' , (req: Request, res: Response)=>{
    const id= req.params.id 

    const newId = req.body.id
    const newEmail= req.body.email
    const newPassword= req.body.password
  

    const user= baseUser.find((user)=>{
        return user.id === id
    })

    if(user){
        user.id= newId || user.id
        user.email= newEmail || user.email
        user.password= newPassword || user.password
      
    }

    res.status(200).send("Atualização realizada")

})

app.put('/products/:id' , (req: Request, res: Response)=>{
    const id= req.params.id 

    const newId = req.body.id
    const newName= req.body.name
    const newPrice= req.body.price

  
  

    const product= baseProduct.find((product)=>{
        return product.id === id
    })

    if(product){
        product.id= newId || product.id
        product.name= newName || product.name
        product.price= newPrice || product.price
      
    }

    res.status(200).send("Atualização realizada")

})