import { useCallback, useEffect, useState } from 'react';
import { Button, Dropdown, Input } from 'semantic-ui-react'
import apiRequest from './helpers/api';
import _ from 'lodash';
import renderArticlesAndQuotes from './renderers/quotes';

function App() {
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [keywords, setKeywords] = useState(null);

  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const getPersons = async () => {
      const persons = await apiRequest({ endpoint: 'persons' });
      console.log(persons);
      setPersons(persons);
      setLoading(false);
    };
    getPersons();
  }, []);

  const onPersonSelectorChange = (event, result) => {
    const { value } = result || event.target;
    setSelectedPerson(_.find(persons, person => person.id === value));
  }

  const search = async () => {
    const searchResult = await apiRequest({ endpoint: 'articlesByPersonAndPhrase', parameters: { person_id: selectedPerson.id, phrase: keywords, all_forms: 'true' } });
    searchResult.searched_person = selectedPerson;

    setSearchResult(searchResult);
  }

  const renderSearchResults = useCallback(() => {
    return renderArticlesAndQuotes(searchResult);
  }, [searchResult]);

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="App">
      <div style={{ minWidth: "600px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
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
