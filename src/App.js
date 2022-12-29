import { useCallback, useEffect, useState } from 'react';
import { Button, Dimmer, Dropdown, Input, Loader } from 'semantic-ui-react'
import apiRequest from './helpers/api';
import _ from 'lodash';
import renderArticles from './renderers/quotes';

function App() {
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [keywords, setKeywords] = useState(null);

  const [searchResult, setSearchResult] = useState(null);


  // get list of persons
  useEffect(() => {
    const getPersons = async () => {
      const persons = await apiRequest({ endpoint: 'persons' });
      console.log(persons);
      setPersons(persons);
      setLoading(false);
    };
    getPersons();
  }, []);

  // onChanges & onClicks
  const onPersonSelectorChange = (event, result) => {
    const { value } = result || event.target;
    setSelectedPerson(_.find(persons, person => person.id === value));
  }

  const search = async () => {
    setLoading(true);
    const searchResult = await apiRequest({ endpoint: 'articlesByPersonAndPhrase', parameters: { person_id: selectedPerson.id, phrase: keywords, all_forms: 'true' } });
    searchResult.searched_person = selectedPerson;

    setSearchResult(searchResult);
    setLoading(false);
  }

  // renderers
  const renderSearchResults = useCallback(() => {
    return renderArticles(searchResult);
  }, [searchResult]);

  return (
    <div className="App">
      <Dimmer blurred inverted active={loading}>
        <Loader />
      </Dimmer>
      <div className="header">
        <div className='header-section'>
          <h2 className='logo-text'>WhatTheySaid</h2>
        </div>
        <div className='header-section'>
          <div style={{ margin: '0 auto' }}>
            <Input placeholder="Keywords" onChange={(event) => {setKeywords(event.target.value)}} style={{ marginRight: '3px' }} />
            <Dropdown
              placeholder="Select person"
              search
              selection
              options={persons.map(person => {
                const personFullName = `${person.first_name} ${person.last_name}`;
                return {
                  key: person.id,
                  text: personFullName,
                  value: person.id,
                }
              })}
              onChange={onPersonSelectorChange}
              style={{ marginRight: '3px' }}
            />
            <Button
              onClick={search}
              disabled={!(selectedPerson && keywords)}
              >
              Search
            </Button>

          </div>
        </div>
        <div className='header-section'>
          12 people
          24,000 articles
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <Input placeholder="Keywords" onChange={(event) => {setKeywords(event.target.value)}} />
        <Dropdown
          placeholder="Select person"
          search
          selection
          options={persons.map(person => {
            const personFullName = `${person.first_name} ${person.last_name}`;
            return {
              key: person.id,
              text: personFullName,
              value: person.id,
            }
          })}
          onChange={onPersonSelectorChange}
        />
        <Button
          onClick={search}
          disabled={!(selectedPerson && keywords)}
          >
          Search
        </Button>
      </div>

      <div style={{ marginTop: "20px" }}>
          {renderSearchResults()}
      </div>
    </div>
  );
}



export default App;
