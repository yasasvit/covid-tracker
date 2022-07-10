import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table'
import Box from './components/Box';
import Map from './components/Map';
import Graph from './components/Graph';
import { sortData } from './util';

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
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
        <Box title = "Coronavirus Cases" today = {countryInfo.todayCases} total = {countryInfo.cases}/>
        <Box title = "Recovered" today = {countryInfo.todayRecovered} total = {countryInfo.recovered}/>
        <Box title = "Deaths" today = {countryInfo.todayDeaths} total = {countryInfo.deaths}/>
      </div>
      <Map />
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries = {tableData} />
          <h3>Worldwide New Cases</h3>
          <Graph />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default App;
