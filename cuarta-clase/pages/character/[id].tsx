import { useQuery } from "urql";
import { useRouter } from "next/router";
import { Stack, Text } from "@chakra-ui/react";
import { List, ListItem } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { Card } from "../index";
import Link from "next/link";
import { NextSeo } from "next-seo";
const SingleCharacterQuery = `
  query ($characterId: ID!) {
    character(id: $characterId) {
      id
      image
      name
      status
      species
      created
      gender
      origin {
        name
      }
      location {
        name
      }
      episode {
        name
        id
      }
    }
  }
`;

function CharacterPage() {
  // next hooks
  const { query } = useRouter();

  // constants
  const { id } = query;
  console.log("\n ~ CharacterPage ~ id", id);

  // urql hooks
  const [result] = useQuery({
    query: SingleCharacterQuery,
    variables: { characterId: id },
  });

  const { data, fetching: isLoading, error } = result;
  console.log("\n ~ CharacterPage ~ error", error);
  console.log("\n ~ CharacterPage ~ isLoading", isLoading);
  console.log("\n ~ CharacterPage ~ data", data);

  if (isLoading || error) {
    return null;
  }

  return (
    <Stack>
      {isLoading && <Spinner size="xl" color="white" />}
      <NextSeo
        title={`${data.character.name}`}
        description={`Character ${data.character.id}`}
      />
      <List spacing={3} color="white">
        {data && (
          <Card
            key={data.character.id}
            id={data.character.id}
            imageLink={data.character.image}
            name={data.character.name}
            status={data.character.status}
            specie={data.character.species}
            lastLocation={data.character.name}
            firstSeenIn={data.character.episode[0].name}
          />
        )}

        <Text color="white" fontSize="2xl">
          Episodios
        </Text>
        {data &&
          data.character.episode.map((elem: any) => {
            return (
              <ListItem>
                <Link href={`/episode/${elem.id}`}>{elem.name}</Link>
              </ListItem>
            );
          })}
      </List>
    </Stack>
  );
}

export default CharacterPage;
