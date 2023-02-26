
//verifies our Api key
export const fetchRoboFlow =  async() => {
const requestOptions = { method: 'GET', redirect: 'follow'};
     const res = await fetch(`https://api.roboflow.com/?api_key=${import.meta.env.VITE_ROBOFLOW_API_KEY}`, requestOptions)
     const data = await res.text()
     return data;
}