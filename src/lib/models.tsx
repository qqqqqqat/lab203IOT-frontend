export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  imgurl: string;
  describe: string;
  summary:string;
  category:boolean;
  is_published: boolean;
}
export interface Menu {
  id: number;
  menuname: string;
  price: number;
  imgurl: string;
  is_published: boolean;
}

export interface Order{
  id: number;
  amount:number;
  total:number;
  detail:string;
  getmenuname: String;
}
