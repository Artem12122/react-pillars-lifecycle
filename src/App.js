import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import ClockFace from './Watch/ClockFace.png';
import ClockFace_H from './Watch/ClockFace_H.png';
import ClockFace_M from './Watch/ClockFace_M.png';
import ClockFace_S from './Watch/ClockFace_S.png';



// Timer


function Timer({ s }) {
  const [time, setTime] = useState(0)
  const [pause, setPause] = useState(true)

  useEffect(() => {
    setTime(s)
  }, [s])

  useEffect(() => {
    let timerId

    if (pause && time > 0) {
      timerId = setInterval(() => setTime(time => time - 1), 1000)
    }
    // console.log("star")

    return () => {
      // console.log("clear")
      clearInterval(timerId)
    }
  }, [time === 0, pause, s])

  const formatTime = () => {
    const hours = Math.floor(time / 3600).toString().padStart(2, 0)
    const min = Math.floor((time % 3600) / 60).toString().padStart(2, 0)
    const s = (time % 60).toString().padStart(2, 0)

    return `${hours}: ${min}: ${s}`
  }

  return (
    <div>
      <div>{formatTime(time)}</div>
      <button onClick={() => setPause(pause => !pause)}>{pause ? "пауза" : "відновити"}</button>
    </div>
  )
}


// TimerControl


function TimerControl() {
  const [hours, setHours] = useState(0)
  const [min, setMin] = useState(0)
  const [s, setS] = useState(() => 0)

  const [fulTime, setFullTime] = useState(0)
  // console.log(fulTime)

  return (
    <div>
      {fulTime > 0 && <Timer s={fulTime} />}

      <input type="number" placeholder="години" onChange={e => setHours(e.target.value)} />
      <input type="number" placeholder="хвилини" onChange={e => setMin(e.target.value)} />
      <input type="number" placeholder="секунди" onChange={e => setS(e.target.value)} /><br />
      <button
        disabled={+hours > 24 || +hours < 0 || +min >= 60 || +min < 0 || +s >= 60 || +s < 0}
        onClick={() => {
          setFullTime((hours * 3600) + (min * 60) + +s)
        }}
      >start</button>
    </div>
  )
}


// TimerContainer


const SecondsTimer = ({ seconds }) => <h2>{seconds}</h2>

const TimerContainer = ({ seconds, refresh, render }) => {
  const Render = render
  const [time, setTime] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())

  const [pause, setPause] = useState(true)
  const [pauseTime, setPauseTime] = useState(0)

  useEffect(() => {
    setStartTime(Date.now())
    setTime(0)
  }, [seconds])

  useEffect(() => {
    let timerId

    if (time < seconds && pause) {
      timerId = setInterval(() => setTime(Math.floor((Date.now() - startTime) / 1000)), refresh)
    }

    return () => {
      clearInterval(timerId)
    }

  }, [time < seconds, seconds, refresh, render, startTime, pause])

  const pauseFunc = () => {
    setPause(pause => !pause)

    if (pause) {
      setPauseTime(Date.now())
    } else {
      const pauseEndTime = Date.now()
      setStartTime(startTime => startTime + (pauseEndTime - pauseTime))
    }
  }

  return (
    <>
      <Render seconds={seconds - time} />
      <button onClick={() => pauseFunc()}>{pause ? "пауза" : "відновити"}</button>
    </>
  )
}



// LCD


function LCD({ seconds }) {

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, 0)
    const min = Math.floor((seconds % 3600) / 60).toString().padStart(2, 0)
    const s = (seconds % 60).toString().padStart(2, 0)

    return `${hours}: ${min}: ${s}`
  }

  return <div>{formatTime(seconds)}</div>
}


// Watch


const Watch = ({ seconds }) => {

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, 0)
    const min = Math.floor((seconds % 3600) / 60).toString().padStart(2, 0)
    const s = (seconds % 60).toString().padStart(2, 0)

    return { hours, min, s }
  }

  return (
    <div style={{ marginBottom: "30px" }}>
      <img style={{ zIndex: "-1" }} className='watch' src={ClockFace} />
      <img style={{ transform: `rotate(${formatTime(seconds).hours * 15}deg)`, zIndex: "-1" }} className='watch_H' src={ClockFace_H} />
      <img style={{ transform: `rotate(${formatTime(seconds).min * 6}deg)`, zIndex: "-1" }} className='watch_M' src={ClockFace_M} />
      <img style={{ transform: `rotate(${formatTime(seconds).s * 6}deg)`, zIndex: "-1" }} className='watch_S' src={ClockFace_S} />
    </div>
  )
}


// TimerControl + TimerContainer


// function TimerControlContainer({ refresh = 1000, render }) {
//   const [hours, setHours] = useState(0)
//   const [min, setMin] = useState(0)
//   const [s, setS] = useState(() => 0)

//   const [fulTime, setFullTime] = useState(0)
//   const [time, setTime] = useState(0)
//   const [startTime, setStartTime] = useState(0)

//   const [pause, setPause] = useState(true)
//   const [pauseTime, setPauseTime] = useState(0)

//   const Render = render

//   useEffect(() => {
//     let timerId

//     if (pause && time < fulTime) {
//       timerId = setInterval(() => setTime(Math.floor((Date.now() - startTime) / 1000)), refresh)
//     }

//     return () => {
//       clearInterval(timerId)
//     }
//   }, [time, fulTime, refresh, render, pause])

//   const startTimer = () => {
//     setFullTime((hours * 3600) + (min * 60) + +s)
//     setStartTime(Date.now())
//   }

//   const pauseFunc = () => {
//     setPause(pause => !pause)

//     if (pause) {
//       setPauseTime(Date.now())
//     } else {
//       const pauseEndTime = Date.now()
//       setStartTime(startTime => startTime + (pauseEndTime - pauseTime))
//     }
//   }

//   return (
//     <div>
//       {fulTime > 0 &&
//         <>
//           <Render seconds={fulTime - time} />
//           <button onClick={() => pauseFunc()}>{pause ? "пауза" : "відновити"}</button>
//           <br />
//         </>
//       }
//       <div></div>
//       <input type="number" placeholder="години" onChange={e => setHours(e.target.value)} />
//       <input type="number" placeholder="хвилини" onChange={e => setMin(e.target.value)} />
//       <input type="number" placeholder="секунди" onChange={e => setS(e.target.value)} /><br />
//       <button
//         disabled={+hours > 24 || +hours < 0 || +min >= 60 || +min < 0 || +s >= 60 || +s < 0}
//         onClick={() => startTimer()}
//       >start</button>
//     </div>
//   )
// }

// не надо было объединять timercontrol с timercontainer в один компонент. Пусть timercontrol рендерит timercontainer

const TimerControlContainer = ({ render, refresh = 1000, renderComponent }) => {
  const [hours, setHours] = useState(0)
  const [min, setMin] = useState(0)
  const [s, setS] = useState(() => 0)
  const [fulTime, setFullTime] = useState(0)

  const Render = render
  const RenderComponent = renderComponent

  return (
    <div>
      {fulTime > 0 && <Render refresh={refresh} render={RenderComponent} seconds={fulTime} />}<br />
      <input type="number" placeholder="години" onChange={e => setHours(e.target.value)} />
      <input type="number" placeholder="хвилини" onChange={e => setMin(e.target.value)} />
      <input type="number" placeholder="секунди" onChange={e => setS(e.target.value)} /><br />
      <button
        disabled={+hours > 24 || +hours < 0 || +min >= 60 || +min < 0 || +s >= 60 || +s < 0}
        onClick={() => {
          setFullTime((hours * 3600) + (min * 60) + +s)
        }}
      >start</button>
    </div>
  )
}


// Phonebook


const Phonebook = () => {
  const [phoneNembers, setPhoneNembers] = useState([Math.random(), Math.random()])

  const removePhoneNumber = (el) => {
    const updatedPhoneNumbers = phoneNembers.filter((element) => element !== el )
    setPhoneNembers(updatedPhoneNumbers)
  }

  const upPhoneNumber = (el) => {
    const indexEl = phoneNembers.indexOf(el)
    if (indexEl > 0) {
      const updatedPhoneNumbers = [...phoneNembers]
      updatedPhoneNumbers[indexEl] = updatedPhoneNumbers[indexEl - 1]
      updatedPhoneNumbers[indexEl - 1] = el

      setPhoneNembers(updatedPhoneNumbers)
    }
  }

  const downPhoneNumber = (el) => {
    const indexEl = phoneNembers.indexOf(el)
    if (indexEl < phoneNembers.length - 1) {
      const updatedPhoneNumbers = [...phoneNembers]
      updatedPhoneNumbers[indexEl] = updatedPhoneNumbers[indexEl + 1]
      updatedPhoneNumbers[indexEl + 1] = el

      setPhoneNembers(updatedPhoneNumbers)
    }
  }

  return (
    <div className="phonebook">
      {phoneNembers.map( el =>
        <div key={el}>
          <input
            type="tel"
            id="phone"
            name="phone"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            required
          />
          <button onClick={() => upPhoneNumber(el)} >▲</button>
          <button onClick={() => downPhoneNumber(el)} >▼</button>
          <button onClick={() => removePhoneNumber(el)} >⌫</button>
          <br />
        </div>
      )}
      <button
        style={{padding: "3px 26px"}}
        onClick={() => setPhoneNembers([...phoneNembers, Math.random()])}
      >+</button>
    </div>
  )
}




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Timer</h1>
        <Timer s={120} />
        <h1>TimerControl</h1>
        <TimerControl />
      </header>
      <main>
        <h1>TimerContainer</h1>
        <TimerContainer seconds={1800} refresh={100} render={SecondsTimer} />
        <h1>LCD</h1>
        <TimerContainer seconds={1800} refresh={1000} render={LCD} />
        <h1>Watch</h1>
        <TimerContainer seconds={1800} refresh={10} render={Watch} />
        <h1>TimerControl + TimerContainer</h1>
        {/* <TimerControlContainer refresh={1000} render={LCD} />
        <TimerControlContainer refresh={100} render={Watch} /> */}
        <TimerControlContainer refresh={100} render={TimerContainer} renderComponent={SecondsTimer} />
        <TimerControlContainer refresh={100} render={TimerContainer} renderComponent={LCD} />
        <TimerControlContainer refresh={100} render={TimerContainer} renderComponent={Watch} />
        <h1>Phonebook</h1>
        <Phonebook />
      </main>
    </div>
  );
}

export default App;
