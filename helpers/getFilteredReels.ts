const fs = require("fs");

const getFilteredReelsByMonth = (reels: any) => {
  console.log("reels before filtered by month", reels.length);

  const currentDate = new Date();

  // Filter out Reels from Current Month
  const currentMonth = currentDate.getMonth() || 12;
  // const currentMonth = currentDate.getMonth();

  const reelsFilteredByMonth = reels.filter((reel: InstagramPost) => {
    const reelDate = new Date(reel.timestamp);

    return reelDate.getMonth() === currentMonth - 1;
    // return reelDate.getMonth() === currentMonth;
  });

  console.log("reelsFilteredByMonth", reelsFilteredByMonth.length);

  return reelsFilteredByMonth;
};

function getFilteredReels(reels: any, usernames: string[]) {
  console.log("reels before filtered by algo", reels.length);
  const newReels: any = getFilteredReelsByMonth(reels);
  // const newReels: any = reels;

  const reelsByOwner: any = {};

  // Initialize entries for each page in the object
  usernames.forEach(
    (username) =>
      (reelsByOwner[username] = new Object({
        reels: [],
        avgViewCount: 0,
      }))
  );

  console.log("PASSED username");

  // Sort out the reels by owner and place them in the object
  newReels.forEach(
    (reel: any) =>
      usernames.includes(reel.ownerUsername) &&
      reelsByOwner[reel.ownerUsername].reels.push(reel)
  );

  console.log(
    "PASSED Sort out the reels by owner and place them in the object"
  );

  // Get the avg View Count for each owner
  Object.keys(reelsByOwner).forEach((reelByOwner) => {
    let avgViewCount = 0;
    reelsByOwner[reelByOwner].reels.forEach((reel: any) => {
      avgViewCount = avgViewCount + reel.videoPlayCount;
    });
    avgViewCount = avgViewCount / reelsByOwner[reelByOwner].reels.length;

    reelsByOwner[reelByOwner].avgViewCount = Math.floor(avgViewCount);
  });

  const filteredReels: any = [];

  // Filter out reels with vewCount > avgViewCount and push them into array which will be returned
  Object.keys(reelsByOwner).forEach((reelByOwner) => {
    reelsByOwner[reelByOwner].avgViewCount;

    reelsByOwner[reelByOwner].reels.filter((reel: any) => {
      if (reel.videoPlayCount > reelsByOwner[reelByOwner].avgViewCount) {
        filteredReels.push(reel);
      }
    });
  });

  console.log("filteredReels", filteredReels.length);

  return filteredReels;
}

export { getFilteredReels };
