import logo from './svg/Maha_blanc.svg';
import './App.css';
import {CalendarGraph} from "./CalendarGraph";

const jan_19 = {
  BCG: {
    regions: {
      Ahafo: 2304,
      Ashanti: 3605,
    },
    Ashanti: {
      'Asunafo North': 778,
      'Asunafo South': 374,
      'Asutifi North': 221,
    },
    Ahafo: {
      'Adansi Akrofuom': 778,
      'Adansi Asokwa': 999,
    },
  }
};
const feb_19 = {
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

const years = [
  {
    name: '2019',
    // Ahafo: [1304, 1411],
    // Ashanti: [2605, 1205],
    values: [{
      month: 1,
      region: 'Ahafo',
      value: 1304,
    }, {
      month: 2,
      region: 'Ahafo',
      value: 1411,
    }, {
      month: 1,
      region: 'Ashanti',
      value: 2605,
    }, {
      month: 2,
      region: 'Ashanti',
      value: 1205,
    }],
  }, {
    name: '2020',
    values: [{
      month: 1,
      region: 'Ahafo',
      value: 2304,
    }, {
      month: 2,
      region: 'Ahafo',
      value: 2411,
    }, {
      month: 1,
      region: 'Ashanti',
      value: 3605,
    }, {
      month: 2,
      region: 'Ashanti',
      value: 2205,
    }],
  },
];

// const years2 = [{
//   name: '2020',
//   values: [{
//     month: 'jan_19',
//     Ahafo: 2304,
//   }, {
//     Ahafo: 2411,
//   }, {
//     Ashanti: 2205,
//   }]
// }];

function App() {
  const selectedRegions = ['Ahafo', 'Ashanti'];
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <CalendarGraph
            indicator="BCG"
            years={years}
            selectedRegions={selectedRegions} />
      </div>
  );
}

export default App;
