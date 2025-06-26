const { connectDB } = require("../database/db");

class OrdersController {
  // Obtener todas las órdenes
  async findAll(req, res) {
    try {
      const connection = await connectDB();
      // Recoge la data de la base de datos
      const [data] = await connection.query("SELECT * FROM orders");

      // Si no hay pedidos
      if (data.length === 0) {
        return res.status(404).json({ message: "No se encontraron pedidos." });
      }

      // Si encuentra pedidos
      res
        .status(200)
        .json({ message: "Pedidos obtenidos correctamente", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  // Obtener un pedido por ID
  async findById(req, res) {
    try {
      const connection = await connectDB();
      const { id } = req.params;

      // Recoge la data de la base de datos
      const [data] = await connection.query(
        "SELECT * FROM orders WHERE id = ?",
        [id]
      );

      // Si no hay pedidos
      if (data.length === 0) {
        return res.status(404).json({ message: "Pedido no encontrado." });
      }

      // Si encuentra pedidos
      res
        .status(200)
        .json({ message: "Pedido obtenido correctamente", data: data[0] });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  // Crear un nuevo pedido
  async create(req, res) {
    try {
      const connection = await connectDB();
      const { order_number, order_date, total_products, final_price, status } =
        req.body;

      // Verificar que el pedido no exista
      const [existingOrder] = await connection.query(
        "SELECT * FROM orders WHERE order_number = ?",
        [order_number]
      );

      if (existingOrder.length > 0) {
        return res
          .status(400)
          .json({ message: "El pedido ya está registrado." });
      }

      // Crear nuevo pedido
      const [result] = await connection.query(
        "INSERT INTO orders (order_number, order_date, total_products, final_price, status) VALUES (?, ?, ?, ?, ?)",
        [order_number, order_date, total_products, final_price, status]
      );

      // Respuesta
      res.status(201).json({
        message: "Pedido creado correctamente",
        data: {
          id: result.insertId,
          order_number,
          order_date,
          total_products,
          final_price,
          status,
        },
      });
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  // Crear productos en la tabla products_orders
  async createDetails(req, res) {
    try {
      const connection = await connectDB();
      const { order_id, product_id, qty, total_price } = req.body;

      // Crear nuevo pedido
      const [result] = await connection.query(
        "INSERT INTO order_products (order_id, product_id, qty, total_price) VALUES (?, ?, ?, ?)",
        [order_id, product_id, qty, total_price]
      );

      // Respuesta
      res.status(201).json({
        message: "Detalles de pedido creado correctamente",
        data: { id: result.insertId, order_id, product_id, qty, total_price },
      });
    } catch (error) {
      console.error("Error al crear el detalle de pedido:", error);
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }

  // Actualizar detalle de pedido existente
  async updateDetails(req, res) {
    try {
      const connection = await connectDB();
      const { order_id, product_id, qty, total_price } = req.body;

      // Actualizar el detalle en order_products
      const [result] = await connection.query(
        `UPDATE order_products 
       SET qty = ?, total_price = ? 
       WHERE order_id = ? AND product_id = ?`,
        [qty, total_price, order_id, product_id]
      );

      res.status(200).json({
        message: "Detalle de pedido actualizado correctamente",
        data: { order_id, product_id, qty, total_price },
      });
    } catch (error) {
      console.error("Error al actualizar el detalle de pedido:", error);
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }

  // Actualizar un pedido
  async update(req, res) {
    try {
      const connection = await connectDB();
      const { id } = req.params;
      const { order_number, order_date, total_products, final_price, status } =
        req.body;

      // Actualizar pedido
      const [result] = await connection.query(
        "UPDATE orders SET order_number = ?, order_date = ?, total_products = ?, final_price = ?, status = ? WHERE id = ?",
        [order_number, order_date, total_products, final_price, status, id]
      );

      // Si no se encuentra el pedido
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pedido no encontrado." });
      }

      // Respuesta
      res.status(200).json({
        message: "Pedido actualizado correctamente",
        data: {
          id,
          order_number,
          order_date,
          total_products,
          final_price,
          status,
        },
      });
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }

  // Cambiar solo el estado de un pedido
  async changeStatus(req, res) {
    try {
      const connection = await connectDB();
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res
          .status(400)
          .json({ message: "El campo 'status' es obligatorio." });
      }

      const [result] = await connection.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pedido no encontrado." });
      }

      res.status(200).json({
        message: "Estado del pedido actualizado correctamente",
        data: { id, status },
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }

  // Eliminar un pedido
  async delete(req, res) {
    try {
      const connection = await connectDB();
      const { id } = req.params;

      // Eliminar pedido
      const [result] = await connection.query(
        "DELETE FROM orders WHERE id = ?",
        [id]
      );

      // Si no se encuentra el pedido
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pedido no encontrado." });
      }

      // Respuesta
      res.status(200).json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
}

module.exports = OrdersController;
