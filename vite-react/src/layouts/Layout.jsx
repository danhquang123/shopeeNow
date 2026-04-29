import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FooterAIChat from '../components/AIChat/FooterAIChat';

const Layout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
            <FooterAIChat />
        </div>
    );
};

export default Layout;
