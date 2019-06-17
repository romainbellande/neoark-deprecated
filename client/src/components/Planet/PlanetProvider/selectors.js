export const getBuildingConfiguration = ({ buildingConfigurations }) => id =>
  buildingConfigurations.find(building => building.id === id);

export const getCurrentBuildingConfiguration = ({ selectedBuildingId, ...rest }) =>
  getBuildingConfiguration(rest)(selectedBuildingId);

export const getBuildingByID = ({ buildings }) => id =>
  buildings.find(building => building.id === id);

export const getSelectedBuilding = ({ selectedBuildingId, ...rest }) =>
  getBuildingByID(rest)(selectedBuildingId);

export const getBuildingLevel = state => id => {
  const building = getBuildingByID(state)(id);
  const configuration = getBuildingConfiguration(state)(id);
  return configuration.leveling.find(item => item.level === building.level);
};

export const getCurrentBuildingLevel = ({ selectedBuildingId, ...rest }) =>
  getBuildingLevel(rest)(selectedBuildingId);
