import { useState, useEffect } from 'react';
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import * as loadingData from "./loading.json";
import * as successData from "./success.json";
import Logo from '../../components/Navbar/logo.png';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: successData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const Loading = ({ open}) => {
    return (
        <>
            <FadeIn>
                <div style={{ position: "absolute", zIndex: 1, left: "20%" }}>
                    {open == true ?
                            <Lottie options={defaultOptions} height={200} w5idth={200} />
                        :<></>}
                    </div>
                </FadeIn>
       
     </>
    );
}

export default Loading;

