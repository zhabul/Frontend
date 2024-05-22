export interface SelectedDropdown {
  labelText: string;
  options: { name: string; id: string; selected: boolean }[];
  selectedOptions: { name: string; id: string; selected: boolean }[];
}
