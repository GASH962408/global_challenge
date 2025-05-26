import { gql, useQuery } from "@apollo/client";
import "./App.css";
import icon from "./assets/Vector.png";

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int) {
    characters(page: $page) {
      results {
        id
        name
        species
      }
    }
  }
`;

export default function App() {
  const { data, loading, error } = useQuery(GET_CHARACTERS, {
    variables: { page: 1 },
  });

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Error loading characters: {error.message}</p>;

  return (
    <div className="App__container">
      <nav className="navbar__container">
        <h1>Ravn Rick and Morty</h1>
      </nav>

      <aside className="sidebar__container">
        <div className="character__container">
          <div className="character__container__left">
            <h1>{data.characters.results[0].name}</h1>
            <span>{data.characters.results[0].species}</span>
          </div>
          <div className="character__container__right">
            <img src={icon} alt="arrow" />
          </div>
        </div>
      </aside>

      <main></main>
    </div>
  );
}
