class TypeFactory {
  constructor(scope) {
    this.scope = scope;
  }

  get(action) {
    return `[${this.scope}] ${action}`;
  }
}

const type = new TypeFactory('Map');

export const clickOnTile = type.get('click on tile');

export const removeTile = type.get('remove tile');

export const fetchTiles = type.get('fetchTiles');
