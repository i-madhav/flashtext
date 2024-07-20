import './App.css'
import Logo from './components/Logo'
import Share from './components/share'
function App() {

  return (
    <div className=' bg-green-900 flex flex-col items-center h-screen p-5'>
      <div className=' w-full flex justify-start'>
        <Logo />
      </div>
      <div>
        <Share />
      </div>
    </div>
  )
}

export default App
