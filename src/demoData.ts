// UI fixture only. NOT farmer data. Will be replaced by authenticated API responses.
export type Animal = { id:string; tag:string; className:string; sex:string; breed:string; acquired:string; status:string; weight:number; source:string; mother?:string };
export const animals:Animal[] = [
  {id:'demo-1',tag:'HK-104',className:'Cow',sex:'Female',breed:'Angus',acquired:'2026-08-12',status:'Active',weight:1125,source:'Existing herd'},
  {id:'demo-2',tag:'HK-108',className:'Heifer',sex:'Female',breed:'Hereford',acquired:'2026-09-03',status:'Active',weight:720,source:'Auction purchase'},
  {id:'demo-3',tag:'HK-112',className:'Steer',sex:'Male',breed:'Black Angus',acquired:'2026-10-14',status:'Active',weight:640,source:'Auction purchase'},
  {id:'demo-4',tag:'HK-117',className:'Calf',sex:'Female',breed:'Angus',acquired:'2026-10-22',status:'Active',weight:95,source:'Farm birth',mother:'HK-104'},
  {id:'demo-5',tag:'BACK-503',className:'Bull',sex:'Male',breed:'Mixed',acquired:'2026-10-28',status:'Active',weight:790,source:'Auction purchase'}
];
export const purchases = [
  {id:'PUR-102',date:'2026-10-28',seller:'Example Livestock Auction',animals:1,total:1817.00},
  {id:'PUR-101',date:'2026-10-14',seller:'Example Cattle Sale',animals:1,total:1428.50},
  {id:'PUR-100',date:'2026-09-03',seller:'Example Livestock Auction',animals:1,total:1656.00}
];
export const expenses = [
  {id:'EXP-1',date:'2026-11-03',category:'Feed',description:'Purchased hay',amount:780},
  {id:'EXP-2',date:'2026-10-30',category:'Veterinary',description:'Routine animal care',amount:165},
  {id:'EXP-3',date:'2026-10-26',category:'Fuel',description:'Farm vehicle fuel',amount:84.50}
];
export const treatments = [
  {id:'TR-1',date:'2026-10-30',animal:'HK-112',type:'Vaccination',detail:'Example vaccine entry',status:'Recorded'},
  {id:'TR-2',date:'2026-10-22',animal:'HK-117',type:'Checkup',detail:'Newborn check',status:'Recorded'}
];
export const hayLots=[{id:'HAY-1',name:'Coastal hay',quantity:42,unit:'bales',source:'Purchased',cost:780}];
