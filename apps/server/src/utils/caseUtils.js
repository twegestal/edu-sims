

export const sortAttempts = (attempts) => {
  const map = new Map();

  attempts.map((element) => {
    if (map.has(element.dataValues.case_id)) {
      const currentTimestamp = element.dataValues.timestamp_started;
      const timestampToCompare = map.get(element.dataValues.case_id).timestamp_started;
      if (currentTimestamp > timestampToCompare) {
        map.set(element.dataValues.case_id, element.dataValues);
      }
    } else {
      map.set(element.dataValues.case_id, element.dataValues);
    }
  });

  for (let [caseId, attemptData] of map){
   if (attemptData.is_finished){
      map.delete(caseId)
    }
  }

  const resultArray = Array.from(map, ([key, value]) => ({ case_id: key, ...value }));
  return resultArray;
}

