export async function getFormForUploadingImage() {
  try {
    console.log(process.env.SERVER_URL)
    const res = await fetch(process.env.SERVER_URL);
    const formHtml = res.text();
    return formHtml;
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
}

export async function postImageToServer(imageFile) {
  try {
    const requestOptions = {
      method: 'POST',
      body: new FormData(),
    };
    requestOptions.body.append('image', imageFile);
    requestOptions.body.enctype = 'multipart/form-data';
    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/upload`,
      requestOptions
    );

    if (!res.ok) throw new Error();

    const data = await res.text();
    return JSON.parse(data);
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
}

export async function getRoboFlowPrediction(imageName) {
  try {
    const requestOptions = {
      method: 'POST',
    };
    const res = await fetch(
      `${process.env.SERVER_URL}/roboflow/${imageName}`,
      requestOptions
    );
    const data = await res.text();
    return JSON.parse(data);
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
}
