// import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Compliance from './features/compliance/compliance'
const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to = "/compliance">Compliance</Link>
          </li>
        </ul>
      </nav>
    
      <Routes>
        <Route path="/compliance" element={<Compliance/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
