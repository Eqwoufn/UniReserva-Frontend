import express from 'express';

const app = express();
const PORT = 3005;

app.use(express.json());

// ============================================================
//  DATOS EN MEMORIA (mientras no usamos base de datos)
// ============================================================

function crearUsuario(id, codigoOEmail, password, nombre, rol, carrera) {
  return { id, codigoOEmail, password, nombre, rol, carrera };
}

const listaUsuarios = [
  crearUsuario(1, "20236694", "12345678", "Christian Ricse", "estudiante", "Ingeniería de Sistemas"),
  crearUsuario(2, "christian@gmail.com", "12345678", "Christian Ricse (Admin)", "admin", null),
];

function crearEspacio(id, nombre, categoria, capacidad, disponible, esExtra, imagen, descripcion) {
  return { id, nombre, categoria, capacidad, disponible, esExtra, imagen, descripcion };
}

const listaEspacios = [
  crearEspacio(1, "Piscina", "Áreas Deportivas", 1, true, false, "piscina_ulima.png",
    "Instalación de natación olímpica con carriles oficiales y vestuarios equipados."),
  crearEspacio(2, "Cancha de Fútbol", "Áreas Deportivas", 12, true, false, "futbol_ulima.png",
    "Terreno de césped sintético con medidas oficiales para partidos de fútbol."),
  crearEspacio(3, "Cancha de Basket", "Áreas Deportivas", 10, true, false, "basket_ulima.png",
    "Losa deportiva multiusos equipada con aros oficiales y tableros profesionales."),
  crearEspacio(4, "Sala de Estudio A", "Áreas de Estudio", 3, true, false, "salaetudio_ulima_1.png",
    "Ambiente privado con aislamiento acústico completo ideal para concentrarse en grupo."),
  crearEspacio(5, "Sala de Estudio B", "Áreas de Estudio", 3, true, false, "salaetudio_ulima_2.png",
    "Espacio de trabajo grupal privado dotado de conectividad HDMI y red de alta velocidad."),
  crearEspacio(6, "Laboratorio de IA", "Laboratorios", 5, true, false, "laboratorioia_ulima.png",
    "Sala especializada equipada con computadoras de alta gama y GPUs dedicadas."),
  crearEspacio(7, "Laboratorio de Ing. Civil", "Laboratorios", 5, true, false, "laboratoriocivil_ulima.png",
    "Sala técnica con computadoras equipadas con licencias de AutoCAD y SAP2000."),
];

function crearReserva(id, usuarioId, espacioId, dia, hora, estado) {
  return { id, usuarioId, espacioId, dia, hora, estado };
}

const listaReservas = [];

function crearFalta(id, usuarioId, motivo) {
  return { id, usuarioId, motivo };
}

const listaFaltas = [];

// ============================================================
//  AUTENTICACIÓN (simple, sin JWT por ahora)
// ============================================================

app.post("/login", (req, res) => {
  const codigoOEmail = req.body.codigoOEmail;
  const password = req.body.password;

  const usuario = listaUsuarios.find(
    (item) => item.codigoOEmail == codigoOEmail && item.password == password
  );

  if (usuario) {
    res.status(200).json(usuario);
  } else {
    res.status(401).send("Credenciales incorrectas");
  }
});

// ============================================================
//  ESPACIOS
// ============================================================

// Listar todos los espacios
app.get("/espacio/all", (req, res) => {
  res.status(200).json(listaEspacios);
});

// Obtener un espacio por id
app.get("/espacio/:id", (req, res) => {
  const id = req.params.id;
  const espacio = listaEspacios.find((item) => item.id == id);
  if (espacio) {
    res.status(200).json(espacio);
  } else {
    res.status(404).send("No se encontró el espacio");
  }
});

// Filtrar espacios por categoría y/o disponibilidad: /espacio?categoria=Laboratorios&disponible=true
app.get("/espacio", (req, res) => {
  const categoria = req.query.categoria;
  const disponible = req.query.disponible;

  let resultado = listaEspacios;
  if (categoria) {
    resultado = resultado.filter((item) => item.categoria == categoria);
  }
  if (disponible !== undefined) {
    resultado = resultado.filter((item) => String(item.disponible) == disponible);
  }
  res.status(200).json(resultado);
});

// Crear un espacio extra (máximo 3 extras)
app.post("/espacio", (req, res) => {
  const nombre = req.body.nombre;
  const capacidad = req.body.capacidad;

  const extrasActuales = listaEspacios.filter((item) => item.esExtra == true);
  if (extrasActuales.length >= 3) {
    res.status(409).send("Límite alcanzado: máximo 3 ambientes extra");
    return;
  }

  const espacioNuevo = crearEspacio(
    listaEspacios.length + 1,
    nombre,
    "Áreas de Estudio",
    capacidad,
    true,
    true,
    "salaetudio_ulima_1.png",
    "Sala de estudio extra añadida por la administración."
  );
  listaEspacios.push(espacioNuevo);
  res.status(201).json(espacioNuevo);
});

// Actualizar disponibilidad de un espacio (abrir/cerrar)
app.put("/espacio/:id", (req, res) => {
  const id = req.params.id;
  const disponible = req.body.disponible;

  const espacio = listaEspacios.find((item) => item.id == id);
  if (espacio) {
    espacio.disponible = disponible;
    res.status(200).json(espacio);
  } else {
    res.status(404).send("Espacio no encontrado");
  }
});

// Eliminar un espacio extra
app.delete("/espacio/:id", (req, res) => {
  const id = req.params.id;
  const espacio = listaEspacios.find((item) => item.id == id);

  if (!espacio) {
    res.status(404).send("Espacio no encontrado");
    return;
  }
  if (!espacio.esExtra) {
    res.status(400).send("Solo se pueden eliminar ambientes extra");
    return;
  }

  const index = listaEspacios.indexOf(espacio);
  listaEspacios.splice(index, 1);
  res.status(200).send("El espacio fue eliminado");
});

// ============================================================
//  RESERVAS
// ============================================================

// Listar todas las reservas (para el admin)
app.get("/reserva/all", (req, res) => {
  res.status(200).json(listaReservas.filter((item) => item.estado == "activa"));
});

// Reservas de un usuario en particular: /reserva?usuarioId=1
app.get("/reserva", (req, res) => {
  const usuarioId = req.query.usuarioId;
  const resultado = listaReservas.filter(
    (item) => item.usuarioId == usuarioId && item.estado == "activa"
  );
  res.status(200).json(resultado);
});

// Horarios ya ocupados de un espacio: /reserva/ocupados/:espacioId
app.get("/reserva/ocupados/:espacioId", (req, res) => {
  const espacioId = req.params.espacioId;
  const ocupados = listaReservas.filter(
    (item) => item.espacioId == espacioId && item.estado == "activa"
  );
  res.status(200).json(ocupados);
});

// Crear una reserva
app.post("/reserva", (req, res) => {
  const usuarioId = req.body.usuarioId;
  const espacioId = req.body.espacioId;
  const dia = req.body.dia;
  const hora = req.body.hora;

  const espacio = listaEspacios.find((item) => item.id == espacioId);
  if (!espacio) {
    res.status(404).send("Espacio no encontrado");
    return;
  }
  if (!espacio.disponible) {
    res.status(409).send("Este espacio no está disponible");
    return;
  }

  const yaExiste = listaReservas.find(
    (item) =>
      item.espacioId == espacioId &&
      item.dia == dia &&
      item.hora == hora &&
      item.estado == "activa"
  );
  if (yaExiste) {
    res.status(409).send("Ese horario ya fue reservado");
    return;
  }

  const reservaNueva = crearReserva(
    listaReservas.length + 1,
    usuarioId,
    espacioId,
    dia,
    hora,
    "activa"
  );
  listaReservas.push(reservaNueva);
  res.status(201).json(reservaNueva);
});

// Anular una reserva
app.delete("/reserva/:id", (req, res) => {
  const id = req.params.id;
  const reserva = listaReservas.find((item) => item.id == id);

  if (reserva) {
    reserva.estado = "anulada";
    res.status(200).send("La reserva fue anulada");
  } else {
    res.status(404).send("Reserva no encontrada");
  }
});

// ============================================================
//  FALTAS
// ============================================================

// Faltas de un usuario: /falta?usuarioId=1
app.get("/falta", (req, res) => {
  const usuarioId = req.query.usuarioId;
  const resultado = listaFaltas.filter((item) => item.usuarioId == usuarioId);
  res.status(200).json(resultado);
});

// Agregar una falta
app.post("/falta", (req, res) => {
  const usuarioId = req.body.usuarioId;
  const motivo = req.body.motivo;

  const faltaNueva = crearFalta(listaFaltas.length + 1, usuarioId, motivo);
  listaFaltas.push(faltaNueva);
  res.status(201).json(faltaNueva);
});

// Quitar la última falta de un usuario
app.delete("/falta/:usuarioId", (req, res) => {
  const usuarioId = req.params.usuarioId;
  const faltasDelUsuario = listaFaltas.filter((item) => item.usuarioId == usuarioId);

  if (faltasDelUsuario.length == 0) {
    res.status(404).send("Este usuario no tiene faltas registradas");
    return;
  }

  const ultima = faltasDelUsuario[faltasDelUsuario.length - 1];
  const index = listaFaltas.indexOf(ultima);
  listaFaltas.splice(index, 1);
  res.status(200).send("La falta fue eliminada");
});

// ============================================================

app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto: " + PORT);
});
