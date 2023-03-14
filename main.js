class ProductManager {
    constructor() {
      this.products = [];
    }
  
    getProducts() {
      return this.products;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      const newProduct = {
        id: this.generateId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
      
      const existingProduct = this.products.find(product => product.code === newProduct.code);
      if (existingProduct) {
        throw new Error(`El producto con el código ${newProduct.code} ya existe`);
      }
      
      this.products.push(newProduct);
    }
    
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (!product) {
        throw new Error(`No se encontró el producto con el ID ${id}`);
      }
      return product;
    }
    
    updateProduct(id, updateFields) {
      const productIndex = this.products.findIndex(product => product.id === id);
      if (productIndex === -1) {
        throw new Error(`No se encontró el producto con el ID ${id}`);
      }
      
      const product = this.products[productIndex];
      const updatedProduct = { ...product, ...updateFields };
      if (updatedProduct.id !== product.id) {
        throw new Error("No se puede cambiar el ID del producto");
      }
      
      this.products[productIndex] = updatedProduct;
    }
    
    deleteProduct(id) {
      const productIndex = this.products.findIndex(product => product.id === id);
      if (productIndex === -1) {
        throw new Error(`No se encontró el producto con el ID ${id}`);
      }
      
      this.products.splice(productIndex, 1);
    }
    
    generateId() {
      const timestamp = new Date().getTime().toString(36);
      const randomNumber = Math.random().toString(36).substr(2, 5);
      return `${timestamp}-${randomNumber}`;
    }
  }
  
  const manager = new ProductManager();
  
  const products = manager.getProducts();
  console.log(products); // []
  
  manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
  
  const productId = manager.getProducts()[0].id;
  console.log(manager.getProductById(productId)); // { id: "61df7a1c17n-0jf7u", title: "producto prueba", description: "Este es un producto prueba", price: 200, thumbnail: "Sin imagen", code: "abc123", stock: 25 }
  
  manager.deleteProduct(productId);
  console.log(manager.getProducts()); // []
  
  try {
    manager.deleteProduct(productId);
  } catch (error) {
    console.error(error.message); // "No se encontro el producto con el ID 61df7a1c17n-0jf7u"
  }


