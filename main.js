const fs = require('fs');

class ProductManager{
    #autoID;
    #path;

    constructor(pathFile){
            this.#path = pathFile;
            this.#autoID = 1;
    } 



    async _loadData(){
        try {
            const productsFile = await fs.promises.readFile(this.#path,"utf-8");
            const products = JSON.parse(productsFile);
            if(products.length === 0){
                return [];
            }
            return products; 
        } catch (error) {
            console.log("El archivo no existe");
            console.log(`creando ${this.#path} ...`);
            await fs.promises.writeFile(this.#path,JSON.stringify([]),"utf-8");
            return [];
        }
    }
    async addProduct(product){
        try {
            const {title,description,price,thumbnail,code,stock} = product;
            if(title === undefined || description === undefined || price === undefined || thumbnail === undefined || code=== undefined || stock=== undefined){
                throw new Error("Todos los campos deben ser completados");
            }
            if(!title || !description || !price || !thumbnail || !code ){
                throw new Error("Error, Todos los campos deben ser completados");
            }
            const productsFile = await this._loadData();
            if(productsFile.length !== 0){
                const productExist = productsFile.find(element=> element.code === product.code);
                if(productExist){
                    throw new Error("Error, Ya existe un producto con el mismo codigo");
                }
                this.#autoID = productsFile[productsFile.length-1].id + 1;
            }
            productsFile.push({...product, id:this.#autoID});
            await fs.promises.writeFile(this.#path,JSON.stringify(productsFile,null,2),"utf-8");
            return "Producto agregado con éxito!";
        } catch (error) {
            return error.message; 
        }

    }
    async getProducts(){
        try {
            const productsFile = await this._loadData();
            if(productsFile.length === 0){
                return [];
            }
            return productsFile;    
        } catch (error) {
           return error.message;
           
        }
        }

    async getProductById(productId){
        try {
            const productsFile = await this._loadData();
            if(productsFile.length === 0){
                return "La lista esta vacía";
            }
            const product = productsFile.find(element => element.id === productId);
            if(!product){
                throw new Error(`El producto con id ${productId} no existe`);
            }
            return product;
        } catch (error) {
            return `Error: ${error.message}`;
        }

    }

    async update(productId,product){
        try {
            const productsFile = await this._loadData();
            if(productsFile.length === 0){
                throw new Error("La lista esta vacía")
            }
            const exist = productsFile.find(element => element.id === productId);
            if(!exist){
                throw new Error(`El producto con id ${productId} no existe`);
            }
            const updatedList = this.#_updateList({...exist,...product},productsFile);
            await fs.promises.writeFile(this.#path,JSON.stringify(updatedList,null,2),"utf-8");
            return "Productos actualizados con éxito";
        } catch (error) {
            return error.message;
        }
    }
    async delete(productId){         
            try {
                const productsFile = await this._loadData();
                if(productsFile.length === 0){
                    throw new Error("La lista esta vacía")
                }
                const newProducts  = productsFile.filter(element => element.id !== productId);
                await fs.promises.writeFile(this.#path,JSON.stringify(newProducts,null,2),"utf-8");
                return "Elemento eliminado!"
            } catch (error) {
                return error.message;
            }
    }

    #_updateList(product,productlist){
        const index = productlist.findIndex(element => element.id === product.id);
        if(index === -1){
           throw new Error("el producto no se encuentra");
        } 
        productlist.splice(index,1,product);
        return productlist;
    }


}


const pathFile = "./Productos.json"
const oreos = {
    title:"Oreos",
    description:"Galletitas rellenas con crema blanca",
    price:55,
    thumbnail:"con foto",
    code:"adfg66",
    stock:5
}
const mana = {
    title:"Mana",
    description:"Galletitas simples",
    price:12,
    thumbnail:"sin foto",
    code:"adfg46",
    stock:20,
}
const productList=[
    {
        title:"Oreos",
        description:"Galletitas rellenas",
        price:23,
        thumbnail:"sin foto",
        code:"adfg66",
        stock:15,
    },
    {
        title:"Mana",
        description:"Galletitas simples",
        price:12,
        thumbnail:"sin foto",
        code:"adfg46",
        stock:20,
    },
    {
        title:"Pepitos",
        description:"Galletitas con chips de chocolate",
        price:22,
        thumbnail:"sin foto",
        code:"adfg13",
        stock:15,
    }
]

const main = async ()=>{
    try {
        const galletitas = new ProductManager(pathFile);
        console.log(await galletitas.getProducts());
        console.log(await galletitas.addProduct(productList[0]));
        console.log(await galletitas.addProduct(productList[1]));
        console.log(await galletitas.addProduct(productList[2]));
        console.log(await galletitas.getProducts());
        console.log("El producto con id 1 es: ");
        console.log(await galletitas.getProductById(1));
        console.log(await galletitas.getProductById(4));
        console.log(await galletitas.update(1,oreos));
        console.log("Borrando producto...\n");
        console.log(await galletitas.delete(2));
        console.log(await galletitas.getProducts());
        console.log("Agregando un nuevo producto....")
        console.log(await galletitas.addProduct(productList[1]));
        console.log(await galletitas.getProducts());
    } catch (error) {
        console.log(error)
    }

}

main();

