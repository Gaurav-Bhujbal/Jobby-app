import './index.css'

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img
        className="img"
        alt="not found"
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      />
      <h2>Page Not Found</h2>
      <p>We are sorry, the page you requested could not be found</p>
    </div>
  )
}

export default NotFound
