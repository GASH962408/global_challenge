import { gql, useQuery } from "@apollo/client";
import { useRef, useState, useEffect } from "react";
import "./App.css";
import icon from "./assets/Vector.png";
import spinner from "./assets/spinner.png";

type Character = {
  id: string;
  name: string;
  species: string;
  status: string;
  gender: string;
  image: string;
  location: { name: string };
  origin: { name: string };
  episode: { id: string; name: string }[];
};

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
        episode {
          id
          name
        }
      }
    }
  }
`;

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const page = 1;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [showLoading, setShowLoading] = useState(false);

  const { data, loading, error, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: { page },
    notifyOnNetworkStatusChange: true,
    onCompleted: (newData: any) => {
      setCharacters((prev) => {
        const incoming = newData.characters.results.filter(
          (c: Character) => !prev.some((p) => p.id === c.id)
        );
        const updated = [...prev, ...incoming];
        if (!selectedCharacter && updated.length > 0) {
          setSelectedCharacter(updated[0]);
        }
        return updated;
      });
    },
  });

  useEffect(() => {
    if (loading) {
      setShowLoading(true);
    } else {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const handleScroll = () => {
    if (!sidebarRef.current || loading || !data?.characters?.info?.next) return;
    const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchMore({
        variables: { page: data.characters.info.next },
        updateQuery: (prevResult, { fetchMoreResult }: any) => {
          if (!fetchMoreResult) return prevResult;
          setCharacters((prev) => {
            const incoming = fetchMoreResult.characters.results.filter(
              (c: Character) => !prev.some((p) => p.id === c.id)
            );
            return [...prev, ...incoming];
          });
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
            {showLoading && (
              <div className="loading__container">
                <img src={spinner} alt="spinner" />
                <p>Loading</p>
              </div>
            )}
          </>
        )}
      </aside>

      <main className="main__container">
        {loading && !selectedCharacter ? (
          <div className="skeleton__details">
            <div className="skeleton__line short" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="skeleton__row" key={i}>
                <div className="skeleton__label" />
                <div className="skeleton__value" />
              </div>
            ))}
            <div className="skeleton__image" />
          </div>
        ) : (
          selectedCharacter && (
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
                <span className="details__value">
                  {selectedCharacter.status}
                </span>
              </div>
              <div className="details__row">
                <span className="details__label">Gender</span>
                <span className="details__value">
                  {selectedCharacter.gender}
                </span>
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
              {selectedCharacter.episode?.length > 0 && (
                <div className="episodesImage__wrapper">
                  <div className="episodes__column">
                    <div className="details__header">Episodes</div>
                    {selectedCharacter.episode.slice(0, 5).map((ep) => (
                      <div className="details__row" key={ep.id}>
                        <a
                          className="episode__link"
                          href={`https://rickandmorty.fandom.com/wiki/${encodeURIComponent(
                            ep.name
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ep.name}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="image__column">
                    <img
                      src={selectedCharacter.image}
                      alt={selectedCharacter.name}
                      className="character__image"
                    />
                  </div>
                </div>
              )}
            </section>
          )
        )}
      </main>
    </div>
  );
}
