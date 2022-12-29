import _ from 'lodash';
import { DateTime } from 'luxon';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Popup } from 'semantic-ui-react';

function getSentencesFromJsonContent(jsonContent, searchResult) {
  var jsonContentGroupedBySpeaker = [];

  jsonContent.forEach(articlePiece => {
    const lastAddedJsonContentGroup = jsonContentGroupedBySpeaker[jsonContentGroupedBySpeaker.length - 1];
    if (lastAddedJsonContentGroup?.speaker === articlePiece?.speaker) {
      lastAddedJsonContentGroup.pieces.push(articlePiece.content);
    } else {
      jsonContentGroupedBySpeaker.push({ speaker: articlePiece.speaker, pieces: [articlePiece.content] });
    }
  })

  return _.flatMap(jsonContentGroupedBySpeaker.map(jsonContentGroup => {
    if (jsonContentGroup?.speaker === searchResult.searched_person.id) {
      return _.flatMap(jsonContentGroup.pieces.map(piece => {
        const separatedSentencesInThisPiece = piece.split(/(?<=[?>!.]\s)/).map(content => {
          return { type: 'sentence', content };
        });
        return separatedSentencesInThisPiece;
      }))
    } else {
      return { type: 'separator', content: `---other-speaker---` }
    }
  }));
}

function getSentencesFromContent(content) {
  return content.split(/(?<=[?>!.]\s)/);
}

function renderQuotes(article, searchResult) {
  const regExpString = `\\b${searchResult.terms_searched.join('\\b|\\b')}\\b`;
  const regExp = new RegExp(regExpString, "gi");

  const sentences = article?.json_content ? getSentencesFromJsonContent(article.json_content, searchResult) : getSentencesFromContent(article.content);


  const matchingSentencesIndexes = sentences.map((sentence, dex) => {
    if (sentence.type === 'sentence' && regExp.test(sentence.content)) {
      return dex;
    } else { return undefined }
  }).filter(index => index !== undefined);

  var captureGroups = [];

  matchingSentencesIndexes.forEach(sentenceIndex => {
    const lastCapturedGroup = captureGroups[captureGroups.length - 1];
    const lastCapturedIndex = lastCapturedGroup ? lastCapturedGroup[lastCapturedGroup.length - 1] : 0;
    if (captureGroups.length === 0 || (sentenceIndex - lastCapturedIndex) > 2) {
      captureGroups.push([sentenceIndex]);
    } else {
      captureGroups[captureGroups.length - 1].push(sentenceIndex);
    }
  })

  const finalCaptureGroups = captureGroups.map(captureGroup => {
    const beginIndex = captureGroup[0] - 1 < 0 ? 0 : captureGroup[0] - 1;
    const endIndex = captureGroup[captureGroup.length - 1] + 1 > sentences.length - 1 ? sentences.length - 1 : captureGroup[captureGroup.length - 1] + 1;

    return { start: beginIndex, end: endIndex };
  })

  const finalQuotes = finalCaptureGroups.map(captureGroup => {
    return sentences.slice(captureGroup.start, captureGroup.end + 1).map(sentence => sentence.content).join('');
  })

  function renderQuote(quote, searchResults) {
    const regExpString = `${searchResult.terms_searched.join('|')}`;
    const regExp = new RegExp(regExpString, "gi");
    return quote.split(/\b/).map((word, dex) => {
      if ((regExp).test(word)) {
        return <b key={dex}><u>{word}</u></b>
      }
      return word;
    });
  }

  return finalQuotes.map((quote, dex) => {
    return (
      <div key={dex} className='quote-container' style={{  }}>
        <div>
          <div className='quote-rating-div' id='upvote-quote-div' style={{  }}>
            <Popup size='mini' content='Interesting' mouseEnterDelay={500} position='top center' trigger={
              <IoIosArrowUp/>
            } />
          </div>
          <div className='quote-rating-div'>122</div>
          <div className='quote-rating-div' id='downvote-quote-div' style={{  }}>
            <Popup size='mini' content='Not interesting' mouseEnterDelay={500} position='bottom center' trigger={
              <IoIosArrowDown/>
            } />
          </div>
        </div>
        <p>
          {renderQuote(quote, searchResult, regExp)}
        </p>
      </div>
    );
  })

}

export default function renderArticles(searchResult) {
  if (!searchResult) {
    return 'search something first';
  } else if (searchResult?.articles?.length === 0) {
    return 'no results';
  } else {
    const articles = searchResult?.articles;

    return articles.map((article, dex) => {
      const articleAddedDate = DateTime.fromISO(article.timestamp_added).toLocaleString(DateTime.DATETIME_MED);

      return (
        <div key={dex} className='article-container'>
          <div className='article-header'>
            <h4>{article.title}</h4>
            <p>{articleAddedDate}</p>
          </div>
          <div className='article-content'>
            {renderQuotes(article, searchResult)}
          </div>
        </div>
      );
    })
  }



}