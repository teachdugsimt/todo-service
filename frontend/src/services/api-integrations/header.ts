const Header = async (
  timeout: number | null = 20000,
  options: any = {},
): Promise<any> => {
  const baseURL = "http://localhost:3001"
  let header = {};

  console.log('BASEURL :> ', baseURL);
  header = {
    ...options,
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    timeout: timeout,
  };
  return header;
};

export default Header;
