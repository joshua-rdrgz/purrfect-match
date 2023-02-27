import { fetchPetfinder } from '../apis/petFinderApi.js';

export let createCatOptionsForm = async (htmlElement) => {
  let { type: catTypes } = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat'
  );

  let breeds = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat/breeds'
  );

  let formObj = { ...catTypes, ...breeds };

  let formHTML = `
    <fieldset id="field-age">
      <legend>Age of Cat</legend>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-baby" value="baby">Baby</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-young" value="young">Young</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-adult" value="adult">Adult</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-senior" value="senior">Senior</input>
    </fieldset>
    <fieldset id="field-size">
      <legend>Size of Cat</legend>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-small" value="small">Small</input>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-medium" value="medium">Medium</input>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-large" value="large">Large</input>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-xlarge" value="xlarge">X-Large</input>
    </fieldset>
  `;

  let formIds = ['field-age', 'field-size'];

  for (let pair of Object.entries(formObj)) {
    let [pairKey, pairValues] = pair;
    if (!Array.isArray(pairValues)) continue;

    formIds.push(`selectField-${pairKey}`);

    formHTML += `
      <label for="${pairKey}">${pairKey}</label>
      <select id="selectField-${pairKey}" name="${pairKey}" id="${pairKey}">
        ${pairValues
          .map((pairValue) => {
            let option = pairValue.name ? pairValue.name : pairValue;
            return `
            <option value="${option}">${option}</option>
          `;
          })
          .join('')}
      </select>
    `;
  }

  htmlElement.insertAdjacentHTML('afterbegin', formHTML);

  return formIds.map((formId) => document.getElementById(formId));
};

let generateCatSearchParams = (formElements) => {
  let requestOptions = new URLSearchParams();
  requestOptions.append('type', 'cat');

  for (let formElement of formElements) {
    // FIELD SET INPUTS
    if (formElement.type === 'fieldset') {
      let chosenInputs = Array.from(formElement.children)
        .splice(1) // take off legend / label of fieldset
        .filter((inputElement) => inputElement.checked);

      let chosenFieldName = chosenInputs[0]?.id.split('-')[0];
      let chosenValues = chosenInputs.map(
        (chosenInputEl) => chosenInputEl.value
      );

      if (chosenFieldName) {
        requestOptions.append(
          chosenFieldName,
          chosenValues.join(',').toLowerCase()
        );
      }
    }

    // SELECT / OPTION INPUTS
    if (formElement.type === 'select-one') {
      let generatedChosenFieldName = formElement.id.split('-').at(-1);
      let chosenValues = formElement.options[formElement.selectedIndex].value;
      let chosenFieldName;

      switch (generatedChosenFieldName) {
        case 'coats':
          chosenFieldName = 'coats';
          break;
        case 'colors':
          chosenFieldName = 'color';
          break;
        case 'genders':
          chosenFieldName = 'gender';
          break;
        case 'breeds':
          chosenFieldName = 'breed';
          break;
        default:
          throw new Error('must be: coats, colors, genders, or breeds.');
      }

      requestOptions.append(chosenFieldName, chosenValues.toLowerCase());
    }
  }
  return requestOptions;
};

export let getAvailableCats = async (formElements) => {
  let searchParams = generateCatSearchParams(formElements);
  console.log(searchParams.toString());
  try {
    let data = await fetchPetfinder(
      'https://api.petfinder.com/v2/animals?' + searchParams
    );
    return data;
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
};

export let displayAvailableCats = (data, element) => {
  let { animals: catsForAdoption, pagination } = data;
  console.log(catsForAdoption);
  let sectionHTML = '';

  for (let catForAdoption of catsForAdoption) {
    let {
      name,
      age,
      breeds,
      coat,
      colors,
      description,
      primary_photo_cropped: image,
      tags,
      contact,
    } = catForAdoption;
    sectionHTML += `
      <li>
        <img src="${image.full}" alt="The cute cat, ${name}">
        <h3>${name}</h3>
        <p>Age: ${age} years old</p>
        <p>Primary Breed: ${breeds.primary}</p>
        ${breeds.secondary && `<p>Secondary Breed: ${breeds.secondary}</p>`}
        <p>Primary Color: ${colors.primary}</p>
        ${colors.secondary && `<p>Secondary Color: ${colors.secondary}</p>`}
        ${colors.tertiary && `<p>Tertiary Color: ${colors.tertiary}</p>`}
        <p>Coat: ${coat}</p>
        <p>${description}</p>
        <p>Attributes: ${tags.map((tag) => `<p>${tag}</p>`).join('')}</p>
        <h4>Contact Information</h4>
        ${contact.address.address1 && `<p>${contact.address.address1}</p>`}
        ${contact.address.address2 && `<p>${contact.address.address2}</p>`}
        ${contact.address.city && `<p>${contact.address.city}</p>`}
        ${contact.address.state && `<p>${contact.address.state}</p>`}
        ${contact.address.country && `<p>${contact.address.country}</p>`}
        ${contact.address.postcode && `<p>${contact.address.postcode}</p>`}
        ${contact.email && `<p>${contact.email}</p>`}
        ${contact.phone && `<p>${contact.phone}</p>`}
        <button class="text-for-details-cta bg-red-600">Text Me Details!</button>
      </li>
    `;
  }

  element.insertAdjacentHTML('beforeend', sectionHTML);
};
