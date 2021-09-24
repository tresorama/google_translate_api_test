export const createQueryString = (obj) => new URLSearchParams(obj).toString();

export function FetchData(endpoint, option = {}) {
  return fetch(...[endpoint, option])
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => {
      console.error(err);
    });
}

export const getCached = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
export const setCached = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
