import { fetchPetfinder } from '../apis/petFinderApi.js';
import { catData } from '../utils/fieldSets.js';

export const createCatOptionsForm = async (htmlElement) => {
  let { type: catTypes } = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat'
  );

  let breeds = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat/breeds'
  );

  let formObj = { ...catTypes, ...breeds };

  let formHTML =
    '<div class="flex flex-col md:flex-row justify-around items-center"><div class="flex flex-col">';

  for (const fieldObj of catData) {
    const { name, legend, types } = fieldObj;
    formHTML += `
      <fieldset id="field-${name}" class="flex space-x-4">
      <legend class="ml-3 text-xl font-medium text-white container mx-auto p-5">${legend}: Choose 1 Or More</legend>
      <div class="flex flex-col">
    `;

    for (const type of types) {
      formHTML += `
        <div class="flex flex-row justify-between gap-5">
          <label for="${name}-of-cat-${type}">${type}</label>
          <input type="checkbox" name="${name}-of-cat-${type}" id="age-of-cat-${type}" value="${type}">
        </div>
      `;
    }

    formHTML += `
          </div>
        </fieldset>
    `;
  }
  formHTML += '</div><div class="flex flex-col gap-5">';

  let formIds = ['field-age', 'field-size'];

  for (let pair of Object.entries(formObj)) {
    let [pairKey, pairValues] = pair;
    if (!Array.isArray(pairValues)) continue;

    formIds.push(`selectField-${pairKey}`);

    formHTML += `
      <div>
        <label for="${pairKey}" class="block">${pairKey}</label>
        <div class="inline-block relative w-64">
          <select id="selectField-${pairKey}" name="${pairKey}" class="block appearance-none w-full bg-white text-black border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            ${pairValues
              .map((pairValue) => {
                let option = pairValue.name ? pairValue.name : pairValue;
                return `
                <option value="${option}">${option}</option>
              `;
              })
              .join('')}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
    `;
  }
  formHTML += '</div></div>';

  htmlElement.insertAdjacentHTML('afterbegin', formHTML);

  return formIds.map((formId) => document.getElementById(formId));
};

const generateCatSearchParams = (formElements) => {
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

export const getAvailableCats = async (formElements) => {
  let searchParams = generateCatSearchParams(formElements);
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

const decodeText = (text) => {
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.textContent;
};

export const displayAvailableCats = (data, element) => {
  const { animals: catsForAdoption } = data;
  let sectionHTML = '';

  if (catsForAdoption.length === 0) {
    sectionHTML =
      '<p class="text-2xl text-center font-bold">Sorry, no cats like that are available.  Please try again with different selections!</p>';
    element.insertAdjacentHTML('afterbegin', sectionHTML);
    return;
  }

  sectionHTML =
    '<ul class="grid grid-cols-auto lg:grid-cols-2 2xl:grid-cols-3 gap-5 w-5/6 mx-auto">';

  if (catsForAdoption.length > 0) {
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
      <li class="flex flex-col justify-between bg-gray-700 p-4 break-words">
        <h3 class="text-center text-2xl">${name}</h3>
        <div class="flex flex-col">
          <figure class="w-1/2 mx-auto bg-blue-400">
            <img src="${
              image.full
            }" alt="The cute cat, ${name}" class=" aspect-square">
          </figure>
          <div class="flex flex-col gap-1">
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Primary Breed:</strong> ${breeds.primary}</p>
            ${
              breeds.secondary
                ? `<p><strong>Secondary Breed:</strong> ${breeds.secondary}</p>`
                : ''
            }
            <p><strong>Primary Color:</strong> ${colors.primary}</p>
            ${
              colors.secondary
                ? `<p><strong>Secondary Color:</strong> ${colors.secondary}</p>`
                : ''
            }
            ${
              colors.tertiary
                ? `<p><strong>Tertiary Color:</strong> ${colors.tertiary}</p>`
                : ''
            }
            ${coat ? `<p><strong>Coat:</strong> ${coat}</p>` : ''}
            <p><strong>Description:</strong> ${decodeText(description)}</p>
            ${
              tags.length > 0
                ? `<p><strong>Attributes:</strong> ${tags
                    .reduce((acc, tag) => {
                      acc += `${tag}, `;
                      return acc;
                    }, '')
                    .slice(0, -2)}</p>`
                : ''
            }
            ${
              contact.address
                ? `<h4><strong>Contact Information:</strong></h4>
              ${
                contact.address.address1
                  ? `<p>${contact.address.address1}</p>`
                  : '<p>no street address specified</p>'
              }
              ${
                contact.address.address2
                  ? `<p>${contact.address.address2}</p>`
                  : ''
              }
              ${
                contact.address.city &&
                contact.address.state &&
                contact.address.postcode
                  ? `<p>${contact.address.city}, ${contact.address.state} ${contact.address.country} ${contact.address.postcode}</p>`
                  : ''
              }
              ${contact.email ? `<p>${contact.email}</p>` : ''}
              ${contact.phone ? `<p>${contact.phone}</p>` : ''}`
                : ''
            }
          </div>
        </div>
        <button class="text-for-details-cta bg-indigo-700 hover:bg-indigo-600 text-white p-2">Text Me Details!</button>
      </li>
    `;
    }
  }

  sectionHTML += '</ul>';

  element.insertAdjacentHTML('beforeend', sectionHTML);

  const textDetailsBtns = document.getElementsByClassName(
    'text-for-details-cta'
  );

  Array.from(textDetailsBtns).forEach((textDetailBtn, textDetailBtnId) => {
    textDetailBtn.addEventListener('click', () => {
      const selectedCat = catsForAdoption[textDetailBtnId];
      console.log("this is the selected cat's information: ", selectedCat);

      // From here, we would make a request to our Python code, which would be in an API.  That code would send the text to the user.
    });
  });
};
