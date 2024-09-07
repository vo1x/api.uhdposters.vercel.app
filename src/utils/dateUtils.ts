const getTodayDate = async () => {
  const worldTimeApiURL = `https://worldtimeapi.org/api/timezone/Asia/Kathmandu`;
  try {
    const res = await fetch(worldTimeApiURL).then((res) => res.json());
    console.log(res.datetime);
    return res.datetime.split("T")[0];
  } catch (error) {
    return error;
  }
};

export default getTodayDate;
