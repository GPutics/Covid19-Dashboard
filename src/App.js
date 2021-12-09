import {useState, useEffect} from 'react';
import axios from 'axios';
import numeral from 'numeral'

//components
import InfoBox from './components/InfoBox/InfoBox';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';

//Leaflet stuff
import "leaflet/dist/leaflet.css";

//styles
import './styles/globals.scss';

//muI
import { FormControl, MenuItem, Select, Card, CardContent } from '@mui/material';

//helpers
import {sortCountries, formatStats} from './helpers';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80745, lng: -404796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const fetchWorldWideData = async() => {
      const {data} = await axios.get("https://disease.sh/v3/covid-19/all");
      setCountryInfo(data);
    };
    fetchWorldWideData();
  }, []);

  useEffect(() => {
    const getCountries = async() => {
      const {data} = await axios.get('https://disease.sh/v3/covid-19/countries');
      const countries = data.map((country) => (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ));

        const sortedData = sortCountries(data);

      setCountries(countries);
      setTableData(sortedData);
      setMapCountries(data);
    };
    getCountries();
  }, []);

  const handleChange = async (e) => {
    const country = e.target.value;
    setCountry(country);

    const url = country === "worldwide" 
        ? "https://disease.sh/v3/covid-19/all" 
        : `https://disease.sh/v3/covid-19/countries/${country}`

    const {data} = await axios.get(url);
    setCountryInfo(data);
    console.log(data);
    let lat = country === "worldwide"
      ? "34.80746"
      : data.countryInfo.lat
    let long = country === "worldwide"
      ? "-40.4796"
      : data.countryInfo.long
    setMapCenter([lat, long]);
    setMapZoom(4);
  };

  return (
    <div className="app">

      <div className="left-side">
        <header className="header">
          <h1>Covid-19 Dashboard</h1>
          <FormControl className="dorpdownMenu" variant="standard">
            <Select value={country} onChange={handleChange}>
              <MenuItem value="worldwide">
                Worldwide
              </MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value} key={country.name}>
                    {country.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </header>
        <div className="stats">
          <InfoBox 
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")} 
            title="Cases" 
            cases={formatStats(countryInfo.todayCases)} 
            total={numeral(countryInfo.cases).format('0,0a')} 
          />
          <InfoBox 
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")} 
            title="Recovered" 
            cases={formatStats(countryInfo.todayRecovered)} 
            total={numeral(countryInfo.recovered).format('0,0a')} 
          />
          <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths" 
            cases={formatStats(countryInfo.todayDeaths)} 
            total={numeral(countryInfo.deaths).format('0,0a')} 
          />
        </div>
        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType} />
      </div>

      <Card className="right-side">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new {casesType}</h3>
          <div className="chart">
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
