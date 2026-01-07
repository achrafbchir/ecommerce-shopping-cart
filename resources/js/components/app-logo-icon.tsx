import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/shopFactory logo.png"
            alt="ShopFactory"
            className="h-6 w-auto"
            {...props}
        />
    );
}
