export interface Role {
  menus: string[];
  _id: string;
  name: string;
  create_time: number;
  auth_time?: number;
  auth_name?: string;
}
