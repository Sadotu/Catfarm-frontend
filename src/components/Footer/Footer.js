import React from 'react';
import "./Footer.css"

function Footer() {
    return (
        <footer>
            <p className="copyright">@ Catfarm 2023</p>
            <span className="developer-container">
                <p className="developer">Webdevelopment by </p>
                <p><a href="https://www.linkedin.com/in/nickdekok/" className="Nick">Nick de Kok</a></p>
            </span>
        </footer>
    );
}

export default Footer;