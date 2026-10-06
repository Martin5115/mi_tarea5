# Tarea 5: Servicio Web (Express) + Agenda React

**Curso:** Programación WEB · ITLA · 2026-C-003
**Profesor:** Raydelto Hernández
**Estudiante:** Martin Gomez
**Matricula:** 2024-2481

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
