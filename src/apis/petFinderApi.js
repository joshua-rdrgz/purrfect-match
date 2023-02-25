const getPetfinderAccessToken = async () => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');
  urlencoded.append('client_id', import.meta.env.VITE_PETFINDER_CLIENT_ID);
  urlencoded.append('client_secret', import.meta.env.VITE_PETFINDER_CLIENT_SECRET);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };
  try {
    const res = await fetch(
      'https://api.petfinder.com/v2/oauth2/token',
      requestOptions
    );
    const data = await res.text();
    return JSON.parse(data);
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
};

export const fetchPetfinder = async (url, params = {}) => {
  try {
    const { access_token } = await getPetfinderAccessToken();
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      ...params,
    };

    const res = await fetch(url, requestOptions);

    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

    const data = await res.text();
    return JSON.parse(data)
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
};
