export default function deleteEntitiesContainingId<Entity>(
  array1: Entity[],
  array2: Entity[],
  entityToDelete: Entity,
) {
  array1.splice(array1.indexOf(entityToDelete), 1);
  array2.splice(array2.indexOf(entityToDelete), 1);
}
