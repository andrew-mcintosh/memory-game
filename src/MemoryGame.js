import React, {Component} from 'react';
import shuffle from 'shuffle-array';
import Navbar from './Navbar';
import Card from './Card';


// A card can be in 1 of 3 CardStates
// HIDING - the card is not being shown
// SHOWING - the card is being shown but does not have a match yet
// MATCHING - the card is being shown and has a match.
//            the card should never move from MATCHING to another state during
//            game play.
const CardState = {
  HIDING: 0,
  SHOWING: 1,
  MATCHING: 2
}

export default class MemoryGame extends Component {
  constructor(props) {
    super(props);

    // The cards that we will use for our state.
    let cards = [
      {id: 0, cardState: CardState.HIDING, backgroundColor: '#15F03A'},
      {id: 1, cardState: CardState.HIDING, backgroundColor: '#15F03A'},
      {id: 2, cardState: CardState.HIDING, backgroundColor: '#0E467D'},
      {id: 3, cardState: CardState.HIDING, backgroundColor: '#0E467D'},
      {id: 4, cardState: CardState.HIDING, backgroundColor: '#808000'},
      {id: 5, cardState: CardState.HIDING, backgroundColor: '#808000'},
      {id: 6, cardState: CardState.HIDING, backgroundColor: '#DEEC0B'},
      {id: 7, cardState: CardState.HIDING, backgroundColor: '#DEEC0B'},
      {id: 8, cardState: CardState.HIDING, backgroundColor: '#090909'},
      {id: 9, cardState: CardState.HIDING, backgroundColor: '#090909'},
      {id: 10, cardState: CardState.HIDING, backgroundColor: '#4A086F'},
      {id: 11, cardState: CardState.HIDING, backgroundColor: '#4A086F'},
      {id: 12, cardState: CardState.HIDING, backgroundColor: '#E69500'},
      {id: 13, cardState: CardState.HIDING, backgroundColor: '#E69500'},
      {id: 14, cardState: CardState.HIDING, backgroundColor: '#A1E8EE'},
      {id: 15, cardState: CardState.HIDING, backgroundColor: '#A1E8EE'},
      {id: 16, cardState: CardState.HIDING, backgroundColor: '#0099ff'},
      {id: 17, cardState: CardState.HIDING, backgroundColor: '#0099ff'},
      {id: 18, cardState: CardState.HIDING, backgroundColor: '#ff27b4'},
      {id: 19, cardState: CardState.HIDING, backgroundColor: '#ff27b4'},
      {id: 20, cardState: CardState.HIDING, backgroundColor: '#71783c'},
      {id: 21, cardState: CardState.HIDING, backgroundColor: '#71783c'},
      {id: 22, cardState: CardState.HIDING, backgroundColor: '#afeeee'},
      {id: 23, cardState: CardState.HIDING, backgroundColor: '#afeeee'}
    ];
    cards = shuffle(cards);
    this.state = {cards, noClick: false};
    
    this.handleClick = this.handleClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
  }
  
  handleNewGame() {
    let cards = this.state.cards.map(c => ({
      ...c,
      cardState: CardState.HIDING
    }));
    cards = shuffle(cards);
    this.setState({cards});
  }
  
  handleClick(id) {
    const mapCardState = (cards, idsToChange, newCardState) => {
      return cards.map(c => {
        if (idsToChange.includes(c.id)) {
          return {
            ...c,
            cardState: newCardState
          };
        }
        return c;
      });
    }

    const foundCard = this.state.cards.find(c => c.id === id);
    
    if (this.state.noClick || foundCard.cardState !== CardState.HIDING) {
      return;
    }
    
    let noClick = false;
    
    let cards = mapCardState(this.state.cards, [id], CardState.SHOWING);
    
    const showingCards =  cards.filter((c) => c.cardState === CardState.SHOWING);
    
    const ids = showingCards.map(c => c.id);
    
    if (showingCards.length === 2 &&
        showingCards[0].backgroundColor === showingCards[1].backgroundColor) {
      cards = mapCardState(cards, ids, CardState.MATCHING);
    } else if (showingCards.length === 2) {
      let hidingCards = mapCardState(cards, ids, CardState.HIDING);
      
      noClick = true;
      
      this.setState({cards, noClick}, () => {
        setTimeout(() => {
          // set the state of the cards to HIDING after 1.3 seconds
          this.setState({cards: hidingCards, noClick: false});
        }, 1300);
      });
      return;
    }
    
    this.setState({cards, noClick});
  }

  render() {
    const cards = this.state.cards.map((card) => (
      <Card
        key={card.id}
        showing={card.cardState !== CardState.HIDING}
        backgroundColor={card.backgroundColor}
        onClick={() => this.handleClick(card.id)}
      />
    ));

    return (
      <div>
        <Navbar onNewGame={this.handleNewGame}/>
        {cards}
      </div>
    );
  }
}
