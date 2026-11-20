export const layeringSource = 'https://thetia.shop/en/layering/'
export const layerings: {perfume:string;oil:string;title:string;description:string}[] = []
export const findLayering = (perfume:string,oil:string)=>layerings.find(l=>l.perfume===perfume&&l.oil===oil)
