import React from 'react';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from 'react-loader-spinner';

import './App.css';
import { Character } from './interfaces/Character';
import { api } from './services/api';


function App() {
  const defaultCharacter:Character = {
    id: 1,
    name: "Walter White",
    birthday: "09-07-1958",
    occupation: ["High School Chemistry Teacher", 'Meth King Pin'],
    img: "https://images.amcnetworks.com/amc.com/wp-content/uploads/2015/04/cast_bb_700x1000_walter-white-lg.jpg",
    status: "Presumed dead",
    nickname: "Heisenberg",
    appearance: [1,2,3,4,5],
    portrayed: "Bryan Cranston",
    category: "Breaking Bad",

  }
  const [character, setCharacter] = useState<Character>({} as Character);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const showRandomCharacter = async() => {
      return await api(`character/random`)
        .then((char) => {
          if(!char.data) {
            setCharacter(defaultCharacter);
            return false;
          }
          setCharacter(char.data[0]);
        })
        .catch((error) => {
          console.log(error)
        })
      }      
      showRandomCharacter();
  },[])
  
  const showCharacterByName = async(event?: any) => {
    
    if (event.key === 'Enter' || event === "Button") {
      return await api(`characters?name=${search}`)
        .then((char) => {
          if(!char.data) {
            setCharacter(defaultCharacter);
            return false;
          }
          setCharacter(char.data[0])
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }


  return (
    <div className="container">

      <div className="cardChar">
        <div className="cardCharSearch">
          <input 
            className="cardCharSearchInput" 
            type="text" 
            placeholder="Digite o nome de um personagem"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={showCharacterByName}
          />
          <button 
            className="cardCharButtonSeach"
            onClick={() => {showCharacterByName("Button")}}
            > 
            Procurar 
          </button>
        </div>
        <div className="cardCharHeader">
          <img className="charAvatar" src={character.img} alt="Imagem do Personagem"/>
          <div className="charInformation">
            <p>Apelido: {character.nickname}</p>
            <p>Status: {character.status}</p>
          </div>
        </div>
        <div className="cardCharBody">
          {/* <InfiniteScroll
            dataLength={comments.length}
            next={listCommentsByTweet}
            hasMore={commentHasMore}
            loader={
              <div className="dashboardTweetLoadingIndex">
                <Loader
                  type="ThreeDots"
                  color="#00BFFF"
                  height={100}
                  width={100}
                  visible={commentLoadingIndex}
                />
              </div>
            }>
          </InfiniteScroll> */}
          
        </div>
      </div>
      
      <div className="cardEpisodios">
      </div>
    
    </div>
  );
  
}

export default App;