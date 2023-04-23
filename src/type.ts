export enum CATEGORIAS{
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos"
    }

  // pessoa cliente cadastrada

  export type User ={
    id : string,
    name: string,
    email: string,
    password: string,
    create_at: string
 
  }

  // produto cadastrado
  export type Product ={
      id : string,
      name: string,
      price: number,
      description:string,
      image_url:string
    }

  //   compra realizada por cliente
    export type Purchase ={
      userId : string,
      productId: string,
      quantity: number,
      totalPrice: string
    }

    export type TPurchasekWithUsers = {
      userId : string,
      productId: string,
      quantity: number,
      totalPrice: string
      responsibles: User[]
  }


