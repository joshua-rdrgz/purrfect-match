
//verifies our Api key

export const fetchRoboFlow =  async(url) => {
    console.log(url)
const requestOptions = { method: 'GET', redirect: 'follow'};
     const res = await fetch( url, requestOptions)
     const data = await res.text()
     return data;
}