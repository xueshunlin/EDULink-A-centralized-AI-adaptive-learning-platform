import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navibar } from "../components/Navibar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./FeatureOverviewPage.css";

const FeaturesOverviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openPanel, setOpenPanel] = useState(null); // Track which panel is open

    const togglePanel = (panelId) => {
        setOpenPanel((prevPanel) => (prevPanel === panelId ? null : panelId)); // Toggle panel
    }
    const [nestedPanel, setNestedPanel] = React.useState(null);

    useEffect(() => {
        // Check the hash in the URL and open the corresponding panel
        const hash = location.hash;
        if (hash === "#about") {
            setOpenPanel(1); // Open "About" accordion
        } else if (hash === "#privacy-policy") {
            setOpenPanel(2); // Open "Privacy Policy" accordion
        } else if (hash === "#licensing") {
            setOpenPanel(3); // Open "Licensing" accordion
        }
    }, [location]);

    const toggleNestedPanel = (panelNumber) => {
        setNestedPanel((prev) => (prev === panelNumber ? null : panelNumber));
    };
    const handleGetStarted = () => {
        navigate("/course-page");
    };

    return (
        <div className="features-page">
            <div>
                <Navibar />
            </div>

            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎉 Welcome to Edulink! 🎉</h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                        Edulink is your ultimate platform for streamlined learning, collaboration, and growth. Built to enhance productivity and foster connections, our platform offers everything you need to excel in education and teamwork.
                    </p>
                    <button className="cta-button" onClick={handleGetStarted}>
                        Get Started Now
                    </button>
                </div>
            </section>

            <main className="features">
                {/* Accordion */}
                <section className="accordion w-full max-w-4xl mx-auto">
                    <div>
                        <h2>
                            <button
                                type="button"
                                className={`flex items-center justify-between w-full p-3 text-lg font-medium text-gray-500 border border-b-0 ${openPanel === 1 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    } rounded-t-xl dark:border-gray-700 dark:text-gray-400`}
                                onClick={() => togglePanel(1)}
                            >
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    About Us
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${openPanel === 1 ? "rotate-180" : "rotate-0"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </h2>
                        {openPanel === 1 && (
                            <div className="p-3 text-gray-500 dark:text-gray-400 border border-t-0 border-gray-200 dark:border-gray-700 text-left">
                                <p className="mb-2 text-gray-500 dark:text-gray-400 text-left">
                                    Welcome to EDULink, your centralised adaptive learning platform designed to revolutionise the way you learn. Whether you’re a student, a professional, or a lifelong learner, EDULink offers you a seamless experience to access educational content from multiple sources all in one place. Our mission is to empower learners by providing a unified platform that combines diverse resources with powerful tools to personalise and enhance the learning process.
                                </p>

                                <p className="mb-2 text-gray-500 dark:text-gray-400 text-left">
                                    At EDULink, we believe learning should be comprehensive, accessible, and engaging. With features like categorised learning paths, real-time video transcripts, and interactive note-taking, we aim to transform how you consume and retain knowledge. By integrating videos, articles, PDFs, and research papers into a centralised hub, EDULink ensures you have the tools you need to succeed—no matter your goals or learning style.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2>
                            <button
                                type="button"
                                className={`flex items-center justify-between w-full p-3 text-lg font-medium text-gray-500 border border-b-0 ${openPanel === 2 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    } dark:border-gray-700 dark:text-gray-400`}
                                onClick={() => togglePanel(2)}
                            >
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Privacy Policy
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${openPanel === 2 ? "rotate-180" : "rotate-0"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </h2>
                        {openPanel === 2 && (
                            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                                <p className="mb-2 text-gray-500 dark:text-gray-400 text-left">At EDULink, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you interact with our platform.</p>
                                {/* Nested Accordion */}
                                <div id="accordion-nested-collapse" data-accordion="collapse">
                                    <h2 id="accordion-nested-collapse-heading-1">
                                        <button
                                            type="button"
                                            className={`flex items-center rounded-t-xl justify-between w-full p-3 text-lg font-medium text-gray-500 border ${nestedPanel === 1 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"} dark:border-gray-700 dark:text-gray-400`}
                                            onClick={() => toggleNestedPanel(1)}
                                        >
                                            <span>What Information We Collect</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${nestedPanel === 1 ? "rotate-180" : "rotate-0"}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-4-4-4 4" />
                                            </svg>
                                        </button>
                                    </h2>
                                    {nestedPanel === 1 && (
                                        <div className="p-3 border border-b-0 border-gray-200 dark:border-gray-700">
                                            <ul className="list-disc ps-5 text-gray-500 dark:text-gray-400 text-left">
                                                <li><strong>Account Information:</strong> When you sign up, we collect your name, email address, and any optional profile information you provide.</li>
                                                <li><strong>Usage Data:</strong> To improve our platform, we collect non-identifiable data such as pages visited, time spent on content, and interaction patterns.</li>
                                                <li><strong>Saved Content:</strong> Notes, highlights, and saved learning paths are stored securely for your convenience.</li>
                                            </ul>
                                        </div>
                                    )}
                                    <h2>
                                        <button
                                            type="button"
                                            className={`flex items-center justify-between w-full p-3 text-lg font-medium text-gray-500 border ${nestedPanel === 2 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"} dark:border-gray-700 dark:text-gray-400`}
                                            onClick={() => toggleNestedPanel(2)}
                                        >
                                            <span>How We Use Your Information</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${nestedPanel === 2 ? "rotate-180" : "rotate-0"}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-4-4-4 4" />
                                            </svg>
                                        </button>
                                    </h2>
                                    {nestedPanel === 2 && (
                                        <div className="p-3 border border-b-0 border-gray-200 dark:border-gray-700">
                                            <ul className="list-disc ps-5 text-gray-500 dark:text-gray-400 text-left">
                                                <li>To deliver a personalised learning experience tailored to your preferences.</li>
                                                <li>To provide auto-save features for your notes, transcripts, and other study materials.</li>
                                                <li>To improve our platform and ensure optimal user experience through data analysis.</li>
                                            </ul>
                                        </div>
                                    )}
                                    <h2>
                                        <button
                                            type="button"
                                            className={`flex items-center justify-between w-full p-3 text-lg font-medium text-gray-500 border ${nestedPanel === 3 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"} dark:border-gray-700 dark:text-gray-400`}
                                            onClick={() => toggleNestedPanel(3)}
                                        >
                                            <span>Your Privacy Rights</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${nestedPanel === 3 ? "rotate-180" : "rotate-0"}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-4-4-4 4" />
                                            </svg>
                                        </button>
                                    </h2>
                                    {nestedPanel === 3 && (
                                        <div className="p-3 border border-b-0 border-gray-200 dark:border-gray-700">
                                            <ul className="list-disc ps-5 text-gray-500 dark:text-gray-400 text-left">
                                                <li>You can access, update, or delete your personal data through your account settings.</li>
                                                <li>We do not sell your personal information to third parties. Data is only shared with trusted services required for functionality (e.g., transcript generation, video hosting).</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2>
                            <button
                                type="button"
                                className={`flex items-center justify-between w-full p-3 text-lg font-medium text-gray-500 border ${openPanel === 3 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    } dark:border-gray-700 dark:text-gray-400`}
                                onClick={() => togglePanel(3)}
                            >
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Licensing
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${openPanel === 3 ? "rotate-180" : "rotate-0"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </h2>
                        {openPanel === 3 && (
                            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                                <p className="mb-2 text-gray-500 dark:text-gray-400 text-left">
                                    At EDULink, we are committed to respecting intellectual property rights and ensuring a transparent and fair licensing framework for the content and tools available on our platform.
                                </p>
                                {/* Nested Accordion */}
                                <div className="mt-3">
                                    <h2>
                                        <button
                                            type="button"
                                            className={`flex items-center rounded-t-xl justify-between w-full p-3 text-lg font-medium text-gray-500 border ${nestedPanel === 1 ? "bg-gray-100 dark:bg-gray-800 rounded-t-lg" : "hover:bg-gray-100 dark:hover:bg-gray-800"} dark:border-gray-700 dark:text-gray-400`}
                                            onClick={() => toggleNestedPanel(1)}
                                        >
                                            <span>Content Licensing</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${nestedPanel === 1 ? "rotate-180" : "rotate-0"}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-4-4-4 4" />
                                            </svg>
                                        </button>
                                    </h2>
                                    {nestedPanel === 1 && (
                                        <div className="p-3 border border-b-0 border-gray-200 dark:border-gray-700">
                                            <p className="mb-2 text-gray-500 dark:text-gray-400 text-left">
                                                Resources integrated from third-party platforms (e.g., YouTube, Bilibili, GitHub, ArXiv) remain the property of their respective owners. Users are responsible for adhering to the terms of these platforms.
                                            </p>
                                        </div>
                                    )}
                                    <h2>
                                        <button
                                            type="button"
                                            className={`flex items-center justify-between w-full p-3 text-lg font-medium text-gray-500 border ${nestedPanel === 2 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"} dark:border-gray-700 dark:text-gray-400`}
                                            onClick={() => toggleNestedPanel(2)}
                                        >
                                            <span>User-Generated Content</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${nestedPanel === 2 ? "rotate-180" : "rotate-0"}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-4-4-4 4" />
                                            </svg>
                                        </button>
                                    </h2>
                                    {nestedPanel === 2 && (
                                        <div className="p-3 border border-b-0 border-gray-200 dark:border-gray-700">
                                            <p className="mb-2 text-gray-500 dark:text-gray-400 text-left">
                                                Notes, highlights, and learning paths created by users are stored securely for personal use. EDULink does not claim ownership of user-generated content.
                                            </p>
                                        </div>
                                    )}
                                    <h2>
                                        <button
                                            type="button"
                                            className={`flex items-center justify-between w-full p-3 text-lg font-medium text-gray-500 border ${nestedPanel === 3 ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"} dark:border-gray-700 dark:text-gray-400`}
                                            onClick={() => toggleNestedPanel(3)}
                                        >
                                            <span>Platform Licensing</span>
                                            <svg
                                                className={`w-3 h-3 transition-transform ${nestedPanel === 3 ? "rotate-180" : "rotate-0"}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-4-4-4 4" />
                                            </svg>
                                        </button>
                                    </h2>
                                    {nestedPanel === 3 && (
                                        <div className="p-3 border border-b-0 border-gray-200 dark:border-gray-700">
                                            <p className="mb-2 text-gray-500 dark:text-gray-400 text-left">
                                                EDULink’s tools and software are proprietary. Redistribution or modification without explicit permission is prohibited.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default FeaturesOverviewPage;