import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table'
import Box from './components/Box';
import Map from './components/Map';
import { sortData, prettyPrintStat } from './util';
import 'leaflet/dist/leaflet.css'
import numeral from 'numeral'
 

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(item => (
            {
              name: item.country,
              value: item.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getData()
  }, [])

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => setCountryInfo(data))
  }, [])

  const onCountryChange = async e => {
    const url = e.target.value === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${e.target.value}`
    setCountry(e.target.value)

    await fetch(url) 
      .then(response => response.json())
      .then(data => {
        setCountry(e.target.value)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.lng])
        setMapZoom(4)
      })
    
  }

  return (
    <div className="app">
      <div className="app_left">
      <div className = "app_header">  
         <h1>COVID Tracker</h1>
         <FormControl className = "app_dropdown">
           <Select variant = "outlined" value = {country} onChange = {onCountryChange}>
            <MenuItem value = "worldwide">Worldwide</MenuItem>
            {countries.map(country => <MenuItem value = {country.value}>{country.name}</MenuItem>)} 
           </Select>
          </FormControl>
      </div>
      <div className='app_stats'>
        <Box onclick={(e) => setCasesType("cases")} 
        title = "COVID Cases" 
        active = {casesType === "cases"}
        cases = {prettyPrintStat(countryInfo.todayCases)} 
        total = {numeral(countryInfo.cases).format("0.0a")}/>
        <Box onclick={(e) => setCasesType("recovered")} 
        title = "Recovered" 
        active = {casesType === "recovered"}
        cases = {prettyPrintStat(countryInfo.todayRecovered)} 
        isGreen
        total = {numeral(countryInfo.recovered).format("0.0a")}/>
        <Box onclick={(e) => setCasesType("deaths")} title = "Deaths" 
        cases = {prettyPrintStat(countryInfo.todayDeaths)} 
        total = {numeral(countryInfo.deaths).format("0.0a")}/>
      </div>
      <Map countries = {mapCountries} casesType={casesType} center = {mapCenter} zoom = {mapZoom}/>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3> 
          <Table countries = {tableData} />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default App;
