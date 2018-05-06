export interface State {
  filters: {passFail: string}
  viewType: string
  loadingInspections: boolean;
  loadingBusinesses: boolean;
  isGmapsLoaded: boolean;
  query: string;
  selectedBusiness: string;
  selectedTab: string;
}

export const defaultUIState: State = {
  filters: {passFail: 'all'}, 
  viewType: 'marker', 
  loadingInspections: false,
  loadingBusinesses: false, 
  isGmapsLoaded: false,
  query: null, 
  selectedBusiness: null,
  selectedTab: 'about'
}
