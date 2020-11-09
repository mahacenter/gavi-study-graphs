import { Select, Space } from "antd";
import {useState} from "react";
import indicators from "./data/indicators.json";
import regions from "./data/regions.json";
import logo from './svg/Maha_blanc.svg';
import {CalendarGraph} from "./graph/CalendarGraph";
import {districtsCoverageRateDiff, regionsCoverageRateDiff} from "./data/mappers";
import './App.css';
const { Option } = Select;

function App() {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]);
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const regionDistricts = regions[selectedRegion];

  return (
      <div className="App">
        <header className="App-header">
          <Space size="large">
            <a href="https://www.mahacenter.com/" target="_blank" rel="noreferrer">
                <img src={logo} className="App-logo App-header--component" alt="logo" />
            </a>
            <Select className="App-header--indicators App-header--component"
                    value={selectedIndicator}
                    onChange={setSelectedIndicator}>
              {indicators.map(indicator => <Option value={indicator} key={indicator}>{indicator}</Option>)}
            </Select>
            <Select className="App-header--regions App-header--component"
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
                      placeholder="Select districts"
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
          {selectedRegion ?
              <CalendarGraph
                  indicator={selectedIndicator}
                  years={districtsCoverageRateDiff(selectedIndicator, selectedDistricts)}
                  selectedRegions={selectedDistricts.sort()}/>
          :
              <CalendarGraph
                  indicator={selectedIndicator}
                  years={regionsCoverageRateDiff(selectedIndicator, Object.keys(regions))}
                  selectedRegions={Object.keys(regions).sort()}/>
          }
      </div>
  );
}

export default App;
