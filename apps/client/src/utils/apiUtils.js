export const packageResponse = async (response) => {
  return { status: response.status, headers: response.headers, data: await response.json() };
};
