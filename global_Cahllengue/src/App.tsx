import { gql, useQuery } from "@apollo/client";
import { useRef, useState } from "react";
import "./App.css";
import icon from "./assets/Vector.png";
import spinner from "./assets/spinner.png";

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int) {
    characters(page: $page) {
      info {
        next
      }
      results {
        id
        name
        species
        status
        gender
        image
        location {
          name
        }
        origin {
          name
        }
      }
    }
  }
`;

export default function App() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);

  const { data, loading, error, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: { page },
    notifyOnNetworkStatusChange: true,
    onCompleted: (newData) => {
      setCharacters((prev) => [...prev, ...newData.characters.results]);
    },
  });

  const handleScroll = () => {
    if (!sidebarRef.current || loading || !data?.characters?.info?.next) return;

    const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchMore({
        variables: { page: data.characters.info.next },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          setCharacters((prev) => [
            ...prev,
            ...fetchMoreResult.characters.results,
          ]);
          return fetchMoreResult;
        },
      });
    }
  };

  return (
    <div className="App__container">
      <nav className="navbar__container">
        <h1>Ravn Rick and Morty</h1>
      </nav>

      <aside
        className="sidebar__container"
        ref={sidebarRef}
        onScroll={handleScroll}
      >
        {error ? (
          <div className="error__container">
            <p>Failed to Load Data</p>
          </div>
        ) : (
          <>
            {characters.map((char) => (
              <div
                className="character__container"
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
              >
                <div className="character__container__left">
                  <h1>{char.name}</h1>
                  <span>{char.species}</span>
                </div>
                <div className="character__container__right">
                  <img src={icon} alt="arrow" />
                </div>
              </div>
            ))}
            {loading && (
              <div className="loading__container">
                <img src={spinner} alt="spinner" />
                <p>Loading</p>
              </div>
            )}
          </>
        )}
      </aside>

      <main className="main__container">
        {selectedCharacter ? (
          <section className="character__details">
            <div className="details__header">Character Details</div>

            <div className="details__row">
              <span className="details__label">Name</span>
              <span className="details__value">{selectedCharacter.name}</span>
            </div>
            <div className="details__row">
              <span className="details__label">Species</span>
              <span className="details__value">
                {selectedCharacter.species}
              </span>
            </div>
            <div className="details__row">
              <span className="details__label">Status</span>
              <span className="details__value">{selectedCharacter.status}</span>
            </div>
            <div className="details__row">
              <span className="details__label">Gender</span>
              <span className="details__value">{selectedCharacter.gender}</span>
            </div>
            <div className="details__row">
              <span className="details__label">Location</span>
              <span className="details__value">
                {selectedCharacter.location?.name}
              </span>
            </div>
            <div className="details__row">
              <span className="details__label">Origin</span>
              <span className="details__value">
                {selectedCharacter.origin?.name}
              </span>
            </div>
          </section>
        ) : (
          <h1>Selecciona un personaje del sidebar</h1>
        )}
      </main>
    </div>
  );
}
