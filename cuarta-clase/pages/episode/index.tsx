import React from "react";
import { useQuery } from "urql";
import { useRouter } from "next/router";
import { Stack, Text } from "@chakra-ui/react";
import { List, ListItem } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import Link from "next/link";

import { FC, ChangeEvent, useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Paginator,
  Container,
  Previous,
  Next,
  PageGroup,
  usePaginator,
} from "chakra-paginator";

import { NextSeo } from "next-seo";
const SingleCharacterQuery = `
  query ($pageNumber: Int) {
            episodes(page:$pageNumber){
            info{
            count
            pages
            next
            prev
            }
            results{
            id
            name
            episode
            created
            }
            }   
        }

`;

function CharacterPage() {
  // next hooks
  const [pages, setPages] = React.useState(1);
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1 },
  });
  // urql hooks
  const [result] = useQuery({
    query: SingleCharacterQuery,
    variables: { pageNumber: currentPage },
  });

  const { data, fetching: isLoading, error } = result;

  useEffect(() => {
    if (data) {
      setPages(data.episodes.info.pages);
    }
  }, [data, currentPage]);
  console.log("\n ~ CharacterPage ~ error", error);
  console.log("\n ~ CharacterPage ~ isLoading", isLoading);
  console.log("\n ~ EpiseodeData ~ data", data);

  if (isLoading || error) {
    return null;
  }

  return (
    <Stack>
      <NextSeo
        title="Episode"
        description="Here you can see episodes of Rick and Morty"
      />
      {isLoading && <Spinner size="xl" color="white" />}
      <List spacing={3} color="white">
        {data &&
          data.episodes.results.map((elem: any) => {
            return (
              <ListItem>
                <Text
                  color={
                    "#" + Math.floor(Math.random() * 16777215).toString(16)
                  }
                  fontSize="xl"
                >
                  <Link href={`/episode/${elem.id}`}>{elem.name}</Link>
                </Text>
              </ListItem>
            );
          })}
      </List>

      <ChakraProvider>
        <Paginator
          pagesQuantity={pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        >
          <Container align="center" justify="space-between" w="full" p={4}>
            <Previous>
              Previous
              {/* Or an icon from `react-icons` */}
            </Previous>
            <PageGroup isInline align="center" />
            <Next>
              Next
              {/* Or an icon from `react-icons` */}
            </Next>
          </Container>
        </Paginator>
      </ChakraProvider>
    </Stack>
  );
}

export default CharacterPage;
