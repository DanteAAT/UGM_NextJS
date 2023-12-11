import { HeaderMenu } from '@/components/layout/HeaderMenu';
import { FooterLinks } from '@/components/layout/Footer';

import {  HeroImageRight } from '@/components/layout/landingPage';


     {/* <UserInfoIcons/> */}
export default function Home(){
    return(
        <div>
            <HeaderMenu/>
            <HeroImageRight/>
            <FooterLinks/>    
        </div>
    )
}