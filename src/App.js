import logo from './svg/Maha_blanc.svg';
import './App.css';
import {CalendarGraph} from "./CalendarGraph";

const a = {
  BCG: {
    regions: {
      Ahafo: 2411,
      Ashanti: 2205,
    },
    Ashanti: {
      'Asunafo North': 458,
      'Asunafo South': 454,
      'Asutifi North': 121,
    },
    Ahafo: {
      'Adansi Akrofuom': 218,
      'Adansi Asokwa': 999,
    },
  }
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <CalendarGraph
          years={[2020]}
          ou={Object.keys(a.BCG.regions)} />
    </div>
  );
}

export default App;
