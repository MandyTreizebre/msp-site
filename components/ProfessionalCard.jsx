import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import groupByDay from '../components/groupByDay'

const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']


export default function ProfessionalCard({ pro }) {
  const hasHours = pro.weekly_hours && pro.weekly_hours.length > 0
  console.log(pro.id, pro.weekly_hours)
  return (
    <article className="pro-card">
      <div className="pro-card-main">
        <header className="pro-card-header">
          <h3 className="pro-name">{pro.name}</h3>
        </header>

        <div className="pro-card-body">
          {pro.address && (
            <p className="pro-line">
              <span> <FontAwesomeIcon icon={faLocationDot} className="pro-icon" /> </span>
              <span>
                <span className="pro-label">Adresse :</span> {pro.address}
              </span>
            </p>
          )}
          {pro.telephone && (
            <p className="pro-line">
              <span > <FontAwesomeIcon icon={faPhone} className="pro-icon"/> </span>
              <span>
                <span className="pro-label">Téléphone :</span> <a className="pro-phone" href={`tel:${pro.telephone}`}>
                  {pro.telephone}
                </a>
              </span>
            </p>
          )}
        </div>
      </div>

      {hasHours ? (
        <div className="pro-hours">
          <p className="pro-hours-title">Horaires de consultation</p>
          <ul className="pro-hours-list">
            {groupByDay(pro.weekly_hours).map(day => (
              <li key={day.weekday}>
                <span className="pro-hours-day">
                  {WEEKDAYS[day.weekday]}
                </span>
                <span className="pro-hours-ranges">
                  {day.ranges.join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="pro-hours">
          <p className="pro-no-hours">Horaires non renseignés.</p>
        </div>
      )}
    </article>
  )
}