# AutoFit 🏋️‍♂️📊

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/SantiEUSA/AutoFit)
[![Ecosistema](https://img.shields.io/badge/Stack-React_Native_|_Node.js_|_MongoDB-38bdf8?style=for-the-badge)](https://github.com/SantiEUSA/AutoFit)
[![QA Status](https://img.shields.io/badge/KPI__P95-%E2%89%A4_200_ms-10b981?style=for-the-badge)](https://github.com/SantiEUSA/AutoFit)

**AutoFit** es un ecosistema multiplataforma gamificado diseñado para la gestión antropométrica, el seguimiento del rendimiento físico y la retención de usuarios en centros deportivos. Este software unifica una aplicación móvil híbrida, un panel de analíticas web interactivo y una API REST centralizada bajo una infraestructura contenerizada.

---

## 🗺️ Arquitectura General del Sistema

El ecosistema está diseñado bajo una arquitectura desacoplada de alto rendimiento:

* **Backend Core:** API REST asíncrona construida con Node.js y Express.js, protegida por middlewares de autenticación criptográfica mediante JSON Web Tokens (JWT).
* **Persistencia Documental:** Base de datos NoSQL con MongoDB, gestionada a través de tipos estrictos con Mongoose ODM.
* **Frontend Web:** Panel administrativo de control clínico desarrollado en React.js y estilizado mediante clases utilitarias de Tailwind CSS (Cumple estándares WCAG 2.1 AA).
* **Cliente Móvil:** Aplicación híbrida construida en React Native con arquitectura nativa vinculada a los entornos nativos de Android e iOS.

---

## 📂 Estructura del Proyecto

```text
AutoFit/
├── backend/                         # Servidor API REST (Node.js + Express)
│   ├── config/                      # Conexión a Base de Datos NoSQL
│   ├── middlewares/                 # Control de acceso y descifrado de JWT
│   ├── models/                      # Esquemas de Mongoose (User, Metricas)
│   └── server.js                    # Punto de entrada de la API
├── frontend-web/                    # Panel administrativo (React.js + Tailwind)
│   └── src/pages/Dashboard.jsx      # Reporting analítico con ecuaciones de la OMS
├── mobile/                          # Cliente móvil multiplataforma (React Native)
│   ├── android/                     # Proyecto nativo y directorios Gradle de Android
│   ├── ios/                         # Proyecto nativo para entornos Xcode (iOS)
│   └── src/                         # Componentes, pantallas y hooks de hardware
├── test_integration.js              # Script automatizado de auditoría de carga (KPI P95)
└── docker-compose.yml               # Orquestación de infraestructura local distribuidora
