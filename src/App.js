import { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import './App.css';

const App = () => {

  //import all the stuf from the city list file to a variable
  const locations = require('./city.list.min.json');
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState();
  const [weather, setWeather] = useState({});

  useEffect(() => {
    //Go through every location & add description field
    locations.map(l => {
      l.description = `${l.name.toUpperCase()}${l.state ? `, ${l.state}` : ''}, ${l.country}`;
      return l;
    });
  }, []);

  //We want this to run everytime city changes
  useEffect(() => {
    if (city) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=98b7465353d383f3d0f3bc4a284a48ae`)
        .then(response => response.json())
        .then(result => {
          setWeather({
            temperature: result.main.temp,
            description: result.weather[0].description,
            icon: result.weather[0].icon,
          });
        })
        .catch(e => console.log('error: ', e));
    }
  }, [city]);

  return <div>
    <Autocomplete
      className='search'
      freeSolo
      options={cities}
      onSelect={e => {
          //Get the value typed by the user
        const value = e.target.value.toUpperCase();
        //Cheking if the description has either value that the user is typing
        if (value.length >= 3) {
          const possibleLocations = locations.filter(l => l.description.includes(value))
          .slice(0, 10);
          setCities(possibleLocations.map(l => l.description));
             //Whenever the description matches the value typed by the user, that's when 
            //we are going to look fot the weather of that location
          const selected = locations.find(ac => ac.description === value);
          setCity(selected);
        }
      }}
      renderInput={(params) => <TextField {...params} placeholder='search' variant='outlined' />}
    />
    <div hidden={!weather.temperature}>
      <div className='temperature'
        style={{ color: weather.temperature <= 15 ? 'blue' : 'orangered' }}>
        {weather.temperature}
        <span>&#176;C</span>
      </div>
      <hr />
      <div className='description'>
        {weather.description}
        <img alt='weather icon' src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
      </div>
    </div>
  </div>
}

export default App;
