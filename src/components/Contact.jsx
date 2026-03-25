export default function Contact() {
  return (
    <section className="contact" id="contacto">
      <div className="container">
        <div className="contact-inner">
          <div className="section-label">Contacto</div>

          <h2 className="contact-headline">
            ¿Tienes un proyecto<br />
            en <span className="green">mente?</span>
          </h2>

          <p className="contact-sub">
            Hablemos directamente.
            Sin formularios largos, sin esperas innecesarias.
          </p>

          <div className="contact-channels">
            <a href="mailto:cientogrados@gmail.com" className="contact-channel">
              <span className="contact-channel-icon">&#9993;</span>
              cientogrados@gmail.com
            </a>
            <a
              href="https://wa.me/573225807488?text=Hola%20tengo%20una%20idea%20en%20mente%20y%20quiero%20cotizar"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel"
            >
              <span className="contact-channel-icon">&#9711;</span>
              WhatsApp directo
            </a>
            <a
              href="https://www.youtube.com/@cien80grados"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel"
            >
              <span className="contact-channel-icon">&#9654;</span>
              YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
