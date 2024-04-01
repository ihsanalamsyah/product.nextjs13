
import Link from 'next/link';
import { getCookie } from '../../../utils/cookies';
import ImageUploader from '../../components/products/[...productId]/imageProduct';

import DetailProduct from '../../components/products/[...productId]/detailProduct';




export default async function ProductDetail({params}: {params: {productId: string}}){

    return(
        <div>
            {/* <ImageComponent productId={params.productId[0]}/> */}

            <br></br>

            <DetailProduct productId={params.productId[0]}/>

            <br></br>
            <Link href="/products"><button className="btn btn-error btn-sm">Back to dashboard</button></Link>         
        </div>
    )
}