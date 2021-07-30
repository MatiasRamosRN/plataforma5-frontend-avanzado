import { useQuery } from "urql";
import { useRouter } from "next/router";
import { Stack, Text } from "@chakra-ui/react";
import { List, ListItem } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { Card } from "../index";
import Link from "next/link";
import { NextSeo } from "next-seo";
const SingleCharacterQuery = `
  query ($episodeID: ID!) {
    episode(id:$episodeID){
    	id
        name
        air_date
        episode
        characters{
               id
               name
               status
               species
               type
               gender
               image
               created
        }
        created
    }
  }
`;

function EpisodePage() {
  // next hooks
  const { query } = useRouter();

  // constants
  const { id } = query;
  console.log("\n ~ EpisodePage ~ id", id);

  // urql hooks
  const [result] = useQuery({
    query: SingleCharacterQuery,
    variables: { episodeID: id },
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
      <NextSeo
        title={`${data.episode.name}`}
        description={`Episode ${data.episode.id}`}
      />
      {isLoading && <Spinner size="xl" color="white" />}

      <Card
        key={data.episode.id}
        id={data.episode.id}
        imageLink={"https://i.ytimg.com/vi/pTk0qDNoi3U/maxresdefault.jpg"}
        name={data.episode.name}
        status={"Alive"}
        specie={""}
        lastLocation={""}
        firstSeenIn={""}
      />
      <Text color="white" fontSize="2xl">
        Episode: {data && data.episode.episode}
      </Text>

      <Text color="white" fontSize="2xl">
        Air_date: {data && data.episode.air_date}
      </Text>

      <Text color="white" fontSize="2xl">
        ID: {data && data.episode.id}
      </Text>

      <List spacing={3} color="white">
        <Text color="white" fontSize="2xl">
          Lista de personajes
        </Text>
        {data &&
          data.episode.characters.map((elem: any) => {
            return (
              <ListItem>
                <Link href={`/episode/${elem.id}`}>
                  <Card
                    key={elem.id}
                    id={elem.id}
                    imageLink={elem.image}
                    name={elem.name}
                    status={elem.status}
                    specie={elem.species}
                    lastLocation={elem.name}
                    firstSeenIn={""}
                  />
                </Link>
              </ListItem>
            );
          })}
      </List>
    </Stack>
  );
}

export default EpisodePage;
