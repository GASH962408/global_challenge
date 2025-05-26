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
      }
    }
  }
`;

export default function App() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
              <div className="character__container" key={char.id}>
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

      <main>
        <h1>Selecciona un personaje del sidebar</h1>
      </main>
    </div>
  );
}
