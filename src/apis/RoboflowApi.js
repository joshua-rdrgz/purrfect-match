//check if i need an access token
//docs will tell me everyone
function getImage( ){
alert("You have pressed the button!");

};


const axios = require("axios");
const fs = require("fs");

const image = fs.readFileSync("cat.jpg", {
    encoding: "base64"
});

axios({
    method: "POST",
    url: "https://classify.roboflow.com/purrfect-match-model/42",
    params: {
        api_key: import.meta.env.VITE_ROBOFLOW_API_KEY
    },
    data: image,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})
.then(function(response) {
    console.log(response.data);
})
.catch(function(error) {
    console.log(error.message);
});