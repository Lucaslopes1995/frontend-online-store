export async function getCategories() {
  const endpPoint = 'https://api.mercadolibre.com/sites/MLB/categories';
  const response = await fetch(endpPoint);
  const data = response.json();
  return data;
  // Implemente aqui
}

export async function getProductsFromCategoryAndQuery(/* categoryId, query */) {
  // Implemente aqui! Quando o fizer, descomente os parâmetros que essa função recebe
  const category = 'MLB5672';
  const endpPoint = `https://api.mercadolibre.com/sites/MLB/search?category=${category}`;
  const response = await fetch(endpPoint);
  const data = response.json();
  return data;
}
