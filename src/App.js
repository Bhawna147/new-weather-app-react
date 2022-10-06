import { TbMapSearch } from 'react-icons/tb';
import { TbSearch } from 'react-icons/tb';
import { useState } from 'react';
import { TbVolume } from "react-icons/tb";
import { TbVolumeOff } from "react-icons/tb";
import DetailsCard from './components/DetailsCard';
import SummaryCard from './components/SummaryCard';
import { useTranslation } from 'react-i18next';
import './languages/i18n';

import Astronaut from './asset/not-found.svg';
import SearchPlace from './asset/search.svg';

function App() {
	const API_KEY = process.env.REACT_APP_API_KEY;
  const { t, i18n } = useTranslation();

  const [noData, setNoData] = useState(t('no-data'))
  const [searchTerm, setSearchTerm] = useState('')
  const [weatherData, setWeatherData] = useState([])
  const [city, setCity] = useState(t('unknown-location'))
  const [weatherIcon, setWeatherIcon] = useState(`https://openweathermap.org/img/wn/10n@2x.png`)
  const [currentLanguage, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [backgroundSoundEnabled, setBackgroundSoundEnabled] = useState(true);

	const handleChange = (input) => {
		const { value } = input.target;
		setSearchTerm(value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		getWeather(searchTerm);
	};

  const handleLanguage = (event) => {
    changeLanguage(event.target.value);
  }

  const changeLanguage = (value, location) => {
    i18n
        .changeLanguage(value)
        .then(() => setLanguage(value) && getWeather(location))
        .catch(err => console.log(err));
  };

	const getWeather = async (location) => {
		setLoading(true);
		setWeatherData([]);
		let how_to_search =
			typeof location === 'string'
				? `q=${location}`
				: `lat=${location[0]}&lon=${location[1]}`;

		const url = 'https://api.openweathermap.org/data/2.5/forecast?';
		try {
			let res = await fetch(
				`${url}${how_to_search}&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`
			);
			let data = await res.json();
			if (data.cod !== '200') {
				setNoData('Location Not Found');
				setTimeout(() => {
					setLoading(false);
				}, 500);
				return;
			}
			setWeatherData(data);
			setTimeout(() => {
				setLoading(false);
			}, 500);
			setCity(`${data.city.name}, ${data.city.country}`);
			setWeatherIcon(
				`${
					'https://openweathermap.org/img/wn/' +
					data.list[0].weather[0]['icon']
				}@4x.png`
			);
		} catch (error) {
			setLoading(true)
			console.log(error);
		}
	};


	const myIP = (location) => {
		const { latitude, longitude } = location.coords;
		getWeather([latitude, longitude]);
	};


	return (
		<div className='container'>
			<div className='blur' style={{ top: '-10%', right: '0' }}></div>
			<div className='blur' style={{ top: '36%', left: '-6rem' }}></div>
			<div className='content'>
				<div className='form-container'>
					<div className='name'>
						<div className='logo'>
							Weather App<hr></hr>
						</div>
						<div className='city'>
							<TbMapSearch />
							<p>{city}</p>
						</div>
					</div>
					<div className='search'>
						<h2>{t('title')}</h2>
						<hr />
						<form
							className='search-bar'
							noValidate
							onSubmit={handleSubmit}
						>
							<input
								type='text'
								name=''
								id=''
								placeholder='Explore cities weather'
								onChange={handleChange}
								required
							/>
							<button className='s-icon'>
								<TbSearch
									onClick={() => {
										navigator.geolocation.getCurrentPosition(
											myIP
										);
									}}
								/>
							</button>
						</form>
						<button
							className="s-icon sound-toggler"
							onClick={() => setBackgroundSoundEnabled((prev) => !prev)}
						>
							{backgroundSoundEnabled ? <TbVolume /> : <TbVolumeOff />}
						</button>
					</div>
				</div>
				<div className='info-container'>

             <select className='selected-languange' value={currentLanguage} onChange={(e) => handleLanguage(e)}>
              <option selected value="en">{t('languages.en')}</option>
              <option value="es">{t('languages.es')}</option>
              <option value="fr">{t('languages.fr')}</option>
            </select>

					{ loading ? <div className='loader'></div> :
						<span>
							{weatherData.length === 0 ? (
								<div className='nodata'>
									<h1>{noData}</h1>
										{noData === 'Location Not Found' ? (
											<>
												<img
													src={Astronaut}
													alt='an astronaut lost in the space'
												/>
												<p>
													Oh oh! We've lost in the space finding
													that place.
												</p>
											</>
										) : (
											<>
												<img
													src={SearchPlace}
													alt='a person thinking about what place to find'
												/>
												<p style={{ padding: '20px' }}>
													Don't worry, if you don't know what
													search, try with: Canada, New York or
													maybe Tatooine.
												</p>
											</>
										)}
									</div>
								) : (
									<>
										<h1 className='centerTextOnMobile' >Today</h1>
										<DetailsCard
											weather_icon={weatherIcon}
											data={weatherData}
											soundEnabled={backgroundSoundEnabled}
										/>
										<h1 className='title centerTextOnMobile'>{t('more-on')} {city}</h1>
										<ul className='summary'>
											{weatherData.list.map((days, index) => (
												<SummaryCard key={index} day={days} />
											))}
										</ul>
									</>
								)}
						</span>
					}

				</div>
			</div>
		</div>
	);
}

export default App;