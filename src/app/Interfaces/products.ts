export interface Product {
    id: number;
    title:string;
    price?:number | undefined;
    oldPrice:number;
    description: string;
    category:string;
    image:string;
    isNew:boolean;
    brand:string;
}
export interface Order {
    products: Product[];
    name: string;
    address: string;
    phone: string;
    paymentMethod: string;
}