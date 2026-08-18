import { SOCIAL } from '../data/social'
import SocialIcon from './SocialIcon'

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
              <SocialIcon name="mail" />
              cientogrados@gmail.com
            </a>
            <a
              href="https://wa.me/573225807488?text=Hola%20tengo%20una%20idea%20en%20mente%20y%20quiero%20cotizar"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel"
            >
              <SocialIcon name="whatsapp" />
              WhatsApp directo
            </a>
            {SOCIAL.map(red => (
              <a
                key={red.key}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel"
              >
                <SocialIcon name={red.key} />
                {red.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
