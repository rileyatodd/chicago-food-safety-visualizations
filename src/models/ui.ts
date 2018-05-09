export interface State {
  filters: {}
  viewType: string
  loadingInspections: boolean;
  loadingBusinesses: boolean;
  isGmapsLoaded: boolean;
  query: string;
  selectedBusiness: string;
  selectedTab: string;
}

export const defaultUIState: State = {
  filters: {}, 
  viewType: 'marker', 
  loadingInspections: false,
  loadingBusinesses: false, 
  isGmapsLoaded: false,
  query: null, 
  selectedBusiness: null,
  selectedTab: 'businesses'
}
