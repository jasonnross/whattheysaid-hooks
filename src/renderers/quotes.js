import { Button } from "semantic-ui-react";

export default function renderArticlesAndQuotes(searchResult) {
  console.log(searchResult);

  if (!searchResult) {
    return 'search something first';
  } else if (searchResult?.articles?.length === 0) {
    return 'no results';
  } else {
    return searchResult.articles.map(article => {
      const regExpString = `\\b${searchResult.terms_searched.join('\\b|\\b')}\\b/gi`
      const regExp = new RegExp(regExpString, "i");

      const separatedSentenceElements = article.content.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/);

      console.log(separatedSentenceElements);

    })
    return (
      <div className="result" style={{ backgroundColor: "#f0f0f0", height: "100px" }}>
        <h3>{`${searchResult?.searched_person?.first_name} ${searchResult?.searched_person?.last_name} said:`}</h3>
        <p>This is content</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <Button negative style={{ margin: 0 }}>Less context</Button>
          <Button positive style={{ margin: 0 }}>More context</Button>
        </div>
      </div>
    )
  }
}

function renderQuotesForArticle() {

}