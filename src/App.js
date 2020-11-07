import { Select, Space } from "antd";
import {useState} from "react";
import indicators from "./data/indicators.json";
import regions from "./data/regions.json";
import logo from './svg/Maha_blanc.svg';
import {CalendarGraph} from "./CalendarGraph";
import {indicatorYearsValues} from "./data/mappers";
import './App.css';
const { Option } = Select;
//
// const years = [
//   {
//     name: '2019',
//     // Ahafo: [1304, 1411],
//     // Ashanti: [2605, 1205],
//     values: [{
//       month: 1,
//       regionOrDistrict: 'Ahafo',
//       value: 1304,
//     }, {
//       month: 2,
//       regionOrDistrict: 'Ahafo',
//       value: 1411,
//     }, {
//       month: 1,
//       regionOrDistrict: 'Ashanti',
//       value: 2605,
//     }, {
//       month: 2,
//       regionOrDistrict: 'Ashanti',
//       value: 1205,
//     }],
//   }, {
//     name: '2020',
//     values: [{
//       month: 1,
//       regionOrDistrict: 'Ahafo',
//       value: 2304,
//     }, {
//       month: 2,
//       regionOrDistrict: 'Ahafo',
//       value: 2411,
//     }, {
//       month: 1,
//       regionOrDistrict: 'Ashanti',
//       value: 3605,
//     }, {
//       month: 2,
//       regionOrDistrict: 'Ashanti',
//       value: 2205,
//     }],
//   },
// ];

function App() {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]);
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const regionDistricts = regions[selectedRegion];

  return (
      <div className="App">
        <header className="App-header">
          <Space size="large">
            <img src={logo} className="App-logo App-header--component" alt="logo" />
            <Select className="App-header--indicators App-header--component"
                    value={selectedIndicator}
                    onChange={setSelectedIndicator}>
              {indicators.map(indicator => <Option value={indicator} key={indicator}>{indicator}</Option>)}
            </Select>
            <Select className="App-header--regions App-header--component"
                    allowClear={true}
                    placeholder="Select a region"
                    onChange={region => {
                      setSelectedDistricts([])
                      setSelectedRegion(region);
                    }}>
              <Option value={null} key={"none"}></Option>
              {Object.keys(regions).map(region => <Option value={region} key={region}>{region}</Option>)}
            </Select>
            {regionDistricts &&
              <Select className="App-header--districts App-header--component"
                      mode="tags"
                      tokenSeparators={[',']}
                      maxTagCount={5}
                      value={selectedDistricts}
                      onChange={setSelectedDistricts}>
                {regionDistricts.map(district => <Option value={district} key={district}>{district}</Option>)}
              </Select>
            }
          </Space>
        </header>
        <CalendarGraph
            indicator={selectedIndicator}
            years={indicatorYearsValues(selectedIndicator, selectedDistricts)}
            selectedRegions={selectedDistricts} />
      </div>
  );
}

export default App;
