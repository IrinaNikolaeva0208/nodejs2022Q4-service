export default function setIdToNull(array: any[], id: string, route: string) {
  array
    .filter((entity) => entity[route] == id)
    .forEach((entity) => (entity[route] = null));
}
