import React from "react";
import "./Hero.css"
import {Link} from "react-router-dom";
import Header from "./Header.jsx";
import NewsList from "../../newsSection/NewsList.jsx";
import Home from "../../Home.jsx";
function Hero (){
    return(
        <>
            <Header/>
        <div>

            <section className="hero">
                <div className="hero__inner">
                    <h1 className="hero__eyebrow">Discover Your Next Adventure with AI:</h1>
                    <h2 className="hero__title">Personalized Itineraries at Your Fingertips</h2>
                    <p className="hero__desc">
                        Your personal trip planner and travel curator, creating custom itineraries tailored to your
                        interests and budget.
                    </p>
    <Link className="button" to={"/create-trip"}>
    Get Started , It's Free
    </Link>
                </div>

            </section>

        </div>
            <Home/>

        </>
    )
}

export default Hero