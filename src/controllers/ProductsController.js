const { connectDB } = require("../database/db");

class ProductsController {

  // Obtener todas las órdenes
  async findAll(req, res) {
    try {
      const connection = await connectDB();
      // Recoge la data de la base de datos
      const [data] = await connection.query("SELECT * FROM products");

      // Si no hay productos
      if (data.length === 0) {
        return res.status(404).json({ message: "No se encontraron productos." });
      }

      // Si encuentra productos
      res
        .status(200)
        .json({ message: "Productos obtenidos correctamente", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  // Obtener un producto por ID
  async findById(req, res) {
    try {
      const connection = await connectDB();
      const { id } = req.params;

      // Recoge la data de la base de datos
      const [data] = await connection.query("SELECT * FROM products WHERE id = ?", [id]);

      // Si no hay productos
      if (data.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado." });
      }

      // Si encuentra productos
      res.status(200).json({ message: "Producto obtenido correctamente", data: data[0] });
    } catch (error) {
      res.status(500).json({ message: "Error del servidor", error: error.message });
    }
  }
  // Obtener productos por pedido ID
  async findByOrderId(req, res){
      try {
      const connection = await connectDB();
      const { id } = req.params;

      // Recoge la data de la base de datos
      const [data] = await connection.query("SELECT op.order_id, p.id as product_id, p.name as product_name, p.unit_price, op.qty, op.total_price FROM order_products as op JOIN products as p ON op.product_id = p.id WHERE op.order_id = ?", [id]);

      // Si no hay productos
      if (data.length === 0) {
        return res.status(404).json({ message: "Productos no encontrados." });
      }

      // Si encuentra productos
      res.status(200).json({ message: "Producto obtenido correctamente", data });
    } catch (error) {
      res.status(500).json({ message: "Error del servidor", error: error.message });
    }
  }
  // Crear un nuevo producto
  async create(req, res) {
    try {
      const connection = await connectDB();
      const { name, unit_price, image_url } = req.body;

      // Crear nuevo producto
      const [result] = await connection.query("INSERT INTO products (name, unit_price, image_url) VALUES (?, ?, ?)", [name, unit_price, image_url]);

      // Respuesta
      res.status(201).json({ message: "Producto creado correctamente", data: { id: result.insertId, name, unit_price,  } });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res.status(500).json({ message: "Error del servidor", error: error.message });
    }
  }
  // Actualizar un producto
  async update(req, res) {
    try {
      const connection = await connectDB();
      const { id } = req.params;
      const { name, unit_price, image_url } = req.body;

      // Actualizar producto
      const [result] = await connection.query("UPDATE products SET name = ?, unit_price = ?, image_url = ? WHERE id = ?", [name, unit_price, image_url, id]);

      // Si no se encuentra el producto
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado." });
      }

      // Respuesta
      res.status(200).json({ message: "Producto actualizado correctamente", data: { id, name, unit_price, image_url } });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({ message: "Error del servidor", error: error.message });
    }
  }
  // Eliminar un producto
  async delete(req, res) {
    try {
      const connection = await connectDB();
      const { id } = req.params;

      // Eliminar producto
      const [result] = await connection.query("DELETE FROM products WHERE id = ?", [id]);

      // Si no se encuentra el producto
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado." });
      }

      // Respuesta
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ message: "Error del servidor", error: error.message });
    }
  }

}

module.exports = ProductsController;