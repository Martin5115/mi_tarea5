# Tarea 5: Servicio Web (Express) + Agenda React

**Curso:** Programación WEB 
**Profesor:** Raydelto Hernández
**Estudiante:** Martin Gomez
**Matricula:** 2024-2481

## Capturas de pantalla:

<img width="581" height="370" alt="image" src="https://github.com/user-attachments/assets/e3e7f187-2aa1-4a0b-8264-32924b504e62" />

<img width="625" height="578" alt="image" src="https://github.com/user-attachments/assets/3ccecae8-bbcb-443a-9f45-727dd686ae53" />

<img width="1600" height="860" alt="image" src="https://github.com/user-attachments/assets/7b92dbde-1f90-4ba1-84b9-aa4c96a16e60" />

<img width="345" height="452" alt="image" src="https://github.com/user-attachments/assets/a5b81436-3a6e-4746-abc8-ec7044da0f4c" />

<img width="612" height="70" alt="image" src="https://github.com/user-attachments/assets/f2ba3246-6a18-4e50-b738-eb48e9c74951" />

<img width="1600" height="860" alt="image" src="https://github.com/user-attachments/assets/4658f547-9364-4af5-acd3-0497b5d7725e" />

<img width="163" height="39" alt="image" src="https://github.com/user-attachments/assets/e17225b7-fcd8-4db9-8228-5206db2cb6e0" />

Servicio web hecho con **Node.js + Express** que lista y almacena contactos
(`nombre`, `apellido`, `telefono`) usando el servicio
`http://www.raydelto.org/agenda.php` de las tareas anteriores.
La agenda React de la Tarea 4 ahora consume **este** servicio.

## Endpoints

| Método | Ruta      | Descripción                                        |
|--------|-----------|----------------------------------------------------|
| GET    | `/agenda` | Devuelve todos los contactos en JSON               |
| POST   | `/agenda` | Guarda un contacto (cuerpo JSON con los 3 campos)  |

Si faltan campos, el POST responde `400`. Si el servicio de raydelto.org
falla, responde `502` con un mensaje de error.

```bash
curl http://localhost:3000/agenda

curl -X POST http://localhost:3000/agenda \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Perez","telefono":"809-555-1234"}'
```

## Estructura

```
agenda-react-express/
├── server.js          ← servicio Express (Tarea 5)
├── index.html
├── package.json
├── vite.config.js
└── src/               ← agenda React (Tarea 4)
    ├── main.jsx
    ├── App.jsx        (ahora usa fetch('/agenda'))
    ├── ListaContactos.jsx
    ├── AgregarContacto.jsx
    └── App.css
```

El único cambio en la app React es la URL en `App.jsx`:
`http://www.raydelto.org/agenda.php` → `/agenda`.

## Cómo ejecutarlo

Requisito: [Node.js](https://nodejs.org) 18 o superior.

**Producción (un solo comando):**
```bash
npm install
npm start
```
Abre `http://localhost:3000`. Esto compila React y Express entrega la app y el servicio.

**Desarrollo (dos terminales):**
```bash
npm run server   # Express en el puerto 3000
npm run dev      # Vite en el puerto 5173 (reenvía /agenda a Express)
```

## Notas

- Como el navegador solo habla con Express (mismo origen), desaparece el
  problema de contenido mixto `http`/`https` de la Tarea 4.
- Se puede cambiar el puerto con la variable `PORT`.
