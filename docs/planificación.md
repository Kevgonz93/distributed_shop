# PLANIFICACIÓN 

## 🛠️ Tech Stack (Tu caja de herramientas)

Estas son las tecnologías que vas a usar. No necesitas ser experto en todas antes de empezar, las aprenderás sobre la marcha:

- Lenguaje: TypeScript
- Framework: NestJS
- Base de Datos: PostgreSQL
- Contenedores: Docker & Docker Compose
- Mensajería: RabbitMQ
- ORM: TypeORM o Prisma

---

## 📅 El Plan de Ataque (Por Mini-Sprints)

### 🏃 Sprint 0: La Base (Configuración y Docker)

**Objetivo :** 
Tener dos "Hola Mundo" corriendo en contenedores separados que se ven entre sí.

**Concepto :** 
Entender qué es un ``Dockerfile`` y un ``docker-compose.yml``.

**Tareas :**
- Instalar Docker Desktop.
- Crear un monorepo (o dos repos separados, como prefieras) con dos apps NestJS vacías: ``api-gateway`` y ``inventory-service``.
- Crear un ``docker-compose.yml`` que levante ambas apps a la vez en puertos distintos (ej: 3000 y 3001).
- Entrar en el contenedor de la api-gateway (``docker exec...``) y hacer un ``curl`` o ``ping`` al inventory-service para confirmar que se "ven".

### 🏃 Sprint 1: Lógica de Negocio Aislada (CRUDs)

**Objetivo :**
Que cada servicio funcione bien por separado con su propia base de datos.

**Concepto :**
Database per Service (Cada microservicio tiene SU propia base de datos, nadie toca la del vecino).

**Tareas :**
- Añadir dos servicios de Postgres al ``docker-compose.yml`` (uno para cada app).
- Crear un CRUD para el invetario simple (Product, price, quantity).
- Crear un endpoint simple que genere un JWT falso o básico (no te mates con la seguridad ahora) y un endpoint para crear Pedidos (Orders).

### 🏃 Sprint 2: Comunicación Síncrona (El puente HTTP)

**Objetivo :**
Que el Gateway pida información al Inventario vía HTTP.

**Concepto :** 
Comunicación REST entre servicios (``HttpModule`` de NestJS).

**Tareas :**
- Cuando alguien pide "Ver Producto X" en el Gateway, el Gateway debe hacer una petición HTTP interna al Inventory Service, recibir el dato y dárselo al usuario.
> Nota: Esto es un "anti-patrón" en arquitecturas puras si se abusa, pero es necesario entenderlo para saber por qué luego usaremos RabbitMQ.

### 🏃 Sprint 3: El "Game Changer" (RabbitMQ y Asincronía)

**Objetivo :**
Desacoplar los servicios. Aquí es donde te conviertes en Mid-Level.

**Concepto :**
Event-Driven Architecture (Productores y Consumidores).

**Tareas :**
-	Añadir RabbitMQ al ``docker-compose.yml``.
-	Instalar ``@nestjs/microservices`` y ``amqplib``.
-	Cuando se crea una Orden en el Gateway, en lugar de llamar al Inventario directamente, envía un evento: ``ORDER_CREATED`` a RabbitMQ.
-	El Inventory Service está escuchando. Cuando recibe ``ORDER_CREATED``, busca el producto y resta el stock.

### 🏃 Sprint 4: La "Chapa y Pintura" (Portfolio Ready)

**Objetivo :**
Que el proyecto luzca profesional sin frontend.

**Tareas :**
-	Añadir Swagger (@nestjs/swagger) al Gateway. Documenta los endpoints.
-	Crear un README.md brutal. Explica cómo levantar el proyecto con un solo comando. Diagrama simple de quién habla con quién.

---

## 📚 ¿Qué necesito aprender/reforzar?

Enfócate en estudiar estos conceptos específicos justo antes de necesitarlos:

1. **Docker Compose (Reforzar 🔧)**

	**Qué estudiar**
	Cómo funcionan las redes en Docker (``networks``), cómo persistir datos (``volumes``) y cómo pasar variables de entorno (``environment``).

	**Por qué** 
	Para que tu base de datos no pierda los datos cada vez que apagues el PC y para que los servicios se encuentren por nombre (ej: ``http://inventory-service:3000``).

2. **NestJS Microservices (Nuevo 🧠)**

	**Qué estudiar**
	No estudies todo el framework de nuevo. Ve directo a la documentación de "Microservices" y "RabbitMQ" en la web de NestJS.

	**Por qué** 
	Es clave entender la diferencia entre ``Request-Response`` (Yo pregunto, tú respondes) y ``Event-based`` (Yo aviso que pasó algo, tú verás qué haces).

3. **Inyección de Dependencias (Reforzar 🔧)**

	En NestJS es clave. Asegúrate de entender bien cómo funcionan los ``Modules``, ``Controllers`` y ``Services`` para no tener un código espagueti.

## 💡 Consejo de Supervivencia

-	No intentes programar 4 horas seguidas porque no las tendrás.
-	**Usa la técnica "Coding Sessions de 45 min".**
-	Si un día solo puedes dedicarle 20 minutos, úsalos para **leer documentación** o arreglar un bug pequeño. No intentes implementar RabbitMQ en 20 minutos.
-	**No te obsesiones con el código limpio al principio**. Haz que funcione ("Make it work"), luego hazlo bonito ("Make it right").
