export async function sendSMS(message) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Basic ${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`);
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('Body', 'Hi there, this another test');
  urlencoded.append('From', '+12768001842');
  urlencoded.append('To', '+14379703997');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  try {
    const res = await fetch(
      'https://api.twilio.com/2010-04-01/Accounts/AC30b0f241e5ad0f51328aa8e4830a3c57/Messages.json',
      requestOptions
    );
    const data = res.text();
    return data;
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
}