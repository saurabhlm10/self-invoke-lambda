import { ENV } from "../constants";
import CollectionIGPage from "../model/CollectionIGPage";

const get10Pages = async (page: string, offset: number) => {
  console.log("get10Pages", page, offset);

  const collectionPages = await CollectionIGPage.aggregate([
    { $match: { page: page } },
    { $sort: { followersCount: -1 } },
    { $skip: offset },
    { $limit: Number(ENV.limit) },
  ]);
  if (collectionPages.length === 0) throw new Error("No pages found");

  return collectionPages;
};

export { get10Pages };
