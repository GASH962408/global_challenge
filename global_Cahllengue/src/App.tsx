import { gql, useQuery } from "@apollo/client";
import "./App.css"

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
          <h1>Ravn Star Wars</h1>
      </nav>
      <main>
        <h1>Rick and Morty Characters</h1>
        <ul>
          {data.characters.results.map((char: any) => (
            <li key={char.id}>
              {char.name} - {char.species}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
