require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Espacio } = require('./models');

const espaciosIniciales = [
  { nombre: 'Piscina', categoria: 'Áreas Deportivas', capacidad: 1, imagen: 'piscina_ulima.png',
    descripcion: 'Instalación de natación olímpica con carriles oficiales y vestuarios equipados.' },
  { nombre: 'Cancha de Fútbol', categoria: 'Áreas Deportivas', capacidad: 12, imagen: 'futbol_ulima.png',
    descripcion: 'Terreno de césped sintético con medidas oficiales para partidos de fútbol.' },
  { nombre: 'Cancha de Basket', categoria: 'Áreas Deportivas', capacidad: 10, imagen: 'basket_ulima.png',
    descripcion: 'Losa deportiva multiusos equipada con aros oficiales y tableros profesionales.' },
  { nombre: 'Sala de Estudio A', categoria: 'Áreas de Estudio', capacidad: 3, imagen: 'salaetudio_ulima_1.png',
    descripcion: 'Ambiente privado con aislamiento acústico completo ideal para concentrarse en grupo.' },
  { nombre: 'Sala de Estudio B', categoria: 'Áreas de Estudio', capacidad: 3, imagen: 'salaetudio_ulima_2.png',
    descripcion: 'Espacio de trabajo grupal privado dotado de conectividad HDMI y red de alta velocidad.' },
  { nombre: 'Laboratorio de IA', categoria: 'Laboratorios', capacidad: 5, imagen: 'laboratorioia_ulima.png',
    descripcion: 'Sala especializada equipada con computadoras de alta gama y GPUs dedicadas.' },
  { nombre: 'Laboratorio de Ing. Civil', categoria: 'Laboratorios', capacidad: 5, imagen: 'laboratoriocivil_ulima.png',
    descripcion: 'Sala técnica con computadoras equipadas con licencias de AutoCAD y SAP2000.' },
];

async function seed() {
  await sequelize.sync({ alter: true });

  // Usuario alumno de prueba
  const passwordAlumno = await bcrypt.hash('12345678', 10);
  await Usuario.findOrCreate({
    where: { codigoOEmail: '20236694' },
    defaults: {
      codigoOEmail: '20236694',
      passwordHash: passwordAlumno,
      nombre: 'Christian Ricse',
      rol: 'estudiante',
      carrera: 'Ingeniería de Sistemas',
    },
  });

  // Usuario admin de prueba
  const passwordAdmin = await bcrypt.hash('12345678', 10);
  await Usuario.findOrCreate({
    where: { codigoOEmail: 'christian@gmail.com' },
    defaults: {
      codigoOEmail: 'christian@gmail.com',
      passwordHash: passwordAdmin,
      nombre: 'Christian Ricse (Admin)',
      rol: 'admin',
    },
  });

  // Espacios iniciales (solo si la tabla está vacía)
  const total = await Espacio.count();
  if (total === 0) {
    await Espacio.bulkCreate(espaciosIniciales.map(e => ({ ...e, disponible: true, esExtra: false })));
    console.log(`${espaciosIniciales.length} espacios creados.`);
  } else {
    console.log('Los espacios ya existían, no se duplicaron.');
  }

  console.log('Seed completado.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error en el seed:', err);
  process.exit(1);
});
