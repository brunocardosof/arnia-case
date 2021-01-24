import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from 'react-loader-spinner';
import { FaRandom } from 'react-icons/fa'

import './App.css';
import { Character } from './interfaces/Character';
import { api } from './services/api';
import { Episode } from './interfaces/Episode';
import axios from 'axios';


function App() {
  //Character States
  const defaultCharacter: Character = {
    id: 1,
    name: "Walter+White",
    birthday: "09-07-1958",
    occupation: ["High School Chemistry Teacher", 'Meth King Pin'],
    img: "https://images.amcnetworks.com/amc.com/wp-content/uploads/2015/04/cast_bb_700x1000_walter-white-lg.jpg",
    status: "Presumed dead",
    nickname: "Heisenberg",
    appearance: [1, 2, 3, 4, 5],
    portrayed: "Bryan Cranston",
    category: "Breaking Bad",

  }
  const [character, setCharacter] = useState<Character>({} as Character);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  //Episode States
  const category = {
    bts: "Better Call Saul",
    bb: "Breaking Bad",
  }
  const [episode, setEpisode] = useState<Episode[]>([]);
  const handlesetEpisode = async (episodes: Episode[]) => {
    await setEpisode(() => episodes);
  }
  const [episodeByChracter, setEpisodeByChracter] = useState<Episode[]>([]);

  useEffect(() => {
    const epis = async () => {
      const epis = await fetchEpisodesAndUsers();
    }
    epis()
  }, [])

  const fetchEpisodesAndUsers = async () => {
    const allEpisode = await getAllEpisodes();
    const character = await showRandomCharacter();
    await handleEpisodeByChracter(allEpisode, character);
  }

  // const renderEpisodesList = ():JSX.Element => {
  //   return (
  //     <div className="cardEpisode">
  //     <div className="cardEpisodeBody">
  //       {
  //         episodes && episodes.map((item) => {
  //           <h1>{item.title}</h1>
  //         })
  //       }
  //       <h1>!!!!!!!!!!!!!!!!!!</h1>
  //     </div>
  //   </div>
  //   )
  // }

  const removeSpaces = (string: string) => {
    let stringWithoutSpace = string.trim().replace(/ /g, "+");
    return stringWithoutSpace;
  }

  const getAllEpisodes = async () => {
    return await api(`episodes?series=Breaking+Bad`)
      .then((response) => {
        setEpisode(response.data)
        return response.data
      })

  }

  const showRandomCharacter = async () => {
    setLoading(true);
    return await api(`character/random`)
      .then(async (char) => {
        setLoading(false);
        if (!char.data) {
          await setCharacter(() => defaultCharacter)
          return defaultCharacter;
        }
        setCharacter(char.data[0]);
        return char.data[0];
      })
      .catch((error) => {
        console.log(error)
        setLoading(false);
      })
  }

  const handleEpisodeByChracter = async (episode: Episode[], character: Character) => {
    let array = []
    for (let i = 0; i < episode.length; i++) {
      for (let j = 0; j < episode[i].characters.length; j++) {
        if (
          episode[i].characters[j] === character.name ||
          episode[i].characters[j] === character.nickname ||
          episode[i].characters[j] === character.portrayed
        ) {
          array.push(episode[i])
        }
      }
    }
    console.log("array")
    console.log(array)
    const arraySorte = array.sort(function(a, b) {
      return a.season - b.season;
    });
    setEpisodeByChracter(arraySorte)
  }
  const showCharacterByName = async () => {
    setLoading(true);
    return await api(`characters?name=${search ? removeSpaces(search) : defaultCharacter.name}`)
      .then(async (char) => {
        setLoading(false);
        if (!char.data) {
          await setCharacter(() => defaultCharacter);
          return false;
        }
        setCharacter(char.data[0]);
        return char.data[0];
      })
      .catch((error) => {
        setLoading(false);
        console.log(error)
      })
  }
  return (
    <div className="container">

      <div className="card">
        <div className="cardCharSearch">
          <input
            className="cardCharSearchInput"
            type="text"
            placeholder="Procurar personagem"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="cardCharButtonSeach"
            onClick={() => { showCharacterByName() }}
          >
            Procurar
          </button>
        </div>
        <div className="cardCharHeader">
          {
            character ?
              <>
                <img className="charAvatar" src={character.img} alt="Imagem do Personagem" />
                <div className="charInformation">
                  <FaRandom className="cardCharRandomIcon" onClick={() => fetchEpisodesAndUsers()} />
                  <p>
                    <strong className="charInformationTextTitle">Apelido:</strong>
                    {character.nickname}
                  </p>
                  <p>
                    <strong className="charInformationTextTitle">Status:</strong>
                    {character.status}
                  </p>
                  <Loader
                    type="ThreeDots"
                    color="#004c00"
                    width={100}
                    visible={loading}
                  />
                </div>
              </>
              :
              <h1>Procure algem</h1>
          }
        </div>
      </div>

      <div className="cardEpisode">
        {
          episodeByChracter.map((item) => (
            <ul key={item.title}>
              <li>
                <div className="cardEpisodeList">
                  <strong>Título:</strong> {item.title}<br/>
                  <strong>Temporada:</strong> {item.season}<br/>
                  <strong>Data de Lançamento:</strong> {item.air_date}
                </div>
              </li>
            </ul>
          ))
        }
      </div>

    </div>
  );

}

export default App;