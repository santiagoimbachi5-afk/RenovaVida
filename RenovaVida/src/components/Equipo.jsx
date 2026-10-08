import '../styles/Equipo.css'

// x e y son la posición en % dentro del recuadro; s es el tamaño (1 = normal)
const equipo = [
  { foto: '/equipo/persona1.jpg',  nombre: 'Nombre 1',  cargo: 'Cargo', x: 14, y: 25, s: 1.0 },
  { foto: '/equipo/persona2.jpg',  nombre: 'Nombre 2',  cargo: 'Cargo', x: 35, y: 25, s: 1.1 },
  { foto: '/equipo/persona3.jpg',  nombre: 'Nombre 3',  cargo: 'Cargo', x: 57, y: 30, s: 0.9 },
  { foto: '/equipo/persona4.jpg',  nombre: 'Nombre 4',  cargo: 'Cargo', x: 79, y: 26, s: 1.1 },
  { foto: '/equipo/persona5.jpg',  nombre: 'Nombre 5',  cargo: 'Cargo', x: 88, y: 43, s: 0.9 },
  { foto: '/equipo/persona6.jpg',  nombre: 'Nombre 6',  cargo: 'Cargo', x: 84, y: 58, s: 1.0 },
  { foto: '/equipo/persona7.jpg',  nombre: 'Nombre 7',  cargo: 'Cargo', x: 81, y: 74, s: 1.1 },
  { foto: '/equipo/persona8.jpg',  nombre: 'Nombre 8',  cargo: 'Cargo', x: 69, y: 88, s: 0.9 },
  { foto: '/equipo/persona9.jpg',  nombre: 'Nombre 9',  cargo: 'Cargo', x: 57, y: 76, s: 1.0 },
  { foto: '/equipo/persona10.jpg', nombre: 'Nombre 10', cargo: 'Cargo', x: 44, y: 87, s: 1.1 },
  { foto: '/equipo/persona11.jpg', nombre: 'Nombre 11', cargo: 'Cargo', x: 33, y: 72, s: 0.9 },
  { foto: '/equipo/persona12.jpg', nombre: 'Nombre 12', cargo: 'Cargo', x: 19, y: 88, s: 1.0 },
  { foto: '/equipo/persona13.jpg', nombre: 'Nombre 13', cargo: 'Cargo', x: 10, y: 74, s: 1.1 },
  { foto: '/equipo/persona14.jpg', nombre: 'Nombre 14', cargo: 'Cargo', x: 16, y: 59, s: 0.9 },
  { foto: '/equipo/persona15.jpg', nombre: 'Nombre 15', cargo: 'Cargo', x: 8,  y: 44, s: 1.0 },
]

function Equipo() {
  return (
    <section className="equipo">
      <h2>Conoce nuestro equipo</h2>

      <div className="equipo__lienzo">
        <p className="equipo__texto">
          Somos más de +30 personas unidas por la pasión y el compromiso de
          llevar adelante una misión que nos inspira y nos mueve desde el corazón.
        </p>

        {equipo.map((p, i) => (
          <div
            key={p.foto}
            className="equipo__persona"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--s': p.s,
              '--d': `${i * 0.35}s`,
            }}
          >
            <img src={p.foto} alt={p.nombre} loading="lazy" />
            <span className="equipo__info">
              <strong>{p.nombre}</strong>
              {p.cargo}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Equipo