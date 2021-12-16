// import Reactotron from 'reactotron-react-js'
import { create } from 'apisauce';
import Header from './header';

const ExcuteApi = async (
  url: string,
  params: any,
  method: "get" | "post" | "put" | "patch" | "delete",
  timeout: number | null = 20000,
  optionsHeader: any = {},
) => {
  try {
    const api = create(await Header(timeout, optionsHeader));

    let response;
    if (method.toLowerCase() == 'get') {
      response = await api.get(url, params || {});
    } else if (method.toLowerCase() == 'post') {
      response = await api.post(url, params);
    } else if (method.toLowerCase() == 'put') {
      response = await api.put(url, params);
    } else if (method.toLowerCase() == 'patch') {
      response = await api.patch(url, params);
    } else if (method.toLowerCase() == 'delete') {
      response = await api.delete(url, params);
    }
    return response;
  } catch (error) {
    return error;
  }
};

export default ExcuteApi;
