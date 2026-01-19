import axios from 'axios';
export const GetCountries = async () => {
    const api = "https://restcountries.com/v3.1/all?fields=name,flags"
    return axios.get(api)
}
