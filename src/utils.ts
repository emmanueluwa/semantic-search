import { timeout } from "./config";

export const createPinecodeIndex = async (
  client,
  indexName,
  vectorDimension
) => {
  console.log(`Checking ${indexName} ... :)`);

  const existingIndexes = await client.listIndexes();

  if (!existingIndexes.includes(indexName)) {
    console.log(`Creating ${indexName} ... :)`);

    await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: vectorDimension,
        metric: "cosine",
      },
    });

    console.log(
      `Creating index ... please wait for it to finish initializing :)`
    );
  }
};
