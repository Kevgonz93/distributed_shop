# 🟣 Proyecto 3: ft_distributed_shop
_"Divide y vencerás: Arquitectura de Microservicios"_

---

## 📝 Introducción

Los monolitos son fáciles, pero las grandes empresas usan **sistemas distribuidos**.  
Este proyecto simula un entorno real donde, si una parte falla, el resto debe seguir funcionando o recuperarse.  
No diseñes una API: **diseña un sistema**.

---

## ⚙️ Especificaciones Técnicas (The Subject)

<table>
  <tr>
    <th colspan="2" style="text-align:center;">CARACTERÍSTICAS</th>
  </tr>
  <tr>
    <td><strong>Nombre del Programa</strong></td>
    <td><code>micro-ecom-system</td>
  </tr>
  <tr>
    <td><strong>Lenguajes</strong></td>
    <td>TypeScript (NestJS)</td>
  </tr>
  <tr>
    <td><strong>Infraestructura</strong></td>
    <td>Docker & Docker Compose</td>
  </tr>
  <tr>
    <td><strong>Comunicación</strong></td>
    <td>RabbitMQ (Message Broker)</td>
  </tr>
  <tr>
    <td><strong>Duración Estimada</strong></td>
    <td>3 - 4 semanas</td>
  </tr>
  <tr>
    <td><strong>Nivel de Dificultad</strong></td>
    <td>Avanzado</td>
  </tr>
</table>

---

## 🚀 Requisitos Obligatorios

### **Contenedorización Total**
- Todo debe levantarse con un solo comando:  `docker-compose up`

### **Servicio 1: API Gateway & Auth**
- Único punto de entrada (Puerto 3000).
- Maneja registro/login y emite JWT.
- Redirige peticiones a los otros servicios.

### **Servicio 2: Inventario (Database A)**
- Maneja productos y stock.
- No tiene acceso a la base de datos de pedidos.

### **Servicio 3: Pedidos (Database B)**
- Al crear un pedido, este servicio **no llama directamente** al Inventario.
- Publica un evento `OrderCreated` en RabbitMQ.
- El servicio de Inventario escucha el evento y descuenta stock.

### **Resiliencia**
- Si Inventario está caído, los mensajes deben **quedar en la cola** hasta que el servicio vuelva (persistencia garantizada de RabbitMQ).

---

## 🧠 Objetivos de Aprendizaje (Skills)

- Docker avanzado (networking, volumes).
- Patrón de **Microservicios** vs Monolito.
- Comunicación asíncrona (**Event-Driven Architecture**).
- Manejo de consistencia eventual (¿qué pasa si falla la resta de stock?).
