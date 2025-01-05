import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";
import { Navibar } from "../components/Navibar";
import { Footer } from "../components/Footer";

const Homepage = () => {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div>
      <div>
        <Navibar />
      </div>
      <div className='content'>
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
            <a
              onClick={() => handleNavigation("/features-page")}
              className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              role="alert"
            >
              <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
              <span className="text-sm font-medium">Edulink is out! See what's new</span>
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Learn Anytime, Anywhere </h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Access a wide range of educational videos from various sources to enhance your learning experience.</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleNavigation("/course-page")}
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Get Start
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
            <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
              <span className="font-semibold text-gray-400 uppercase">FEATURED BY</span>
              <div className="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
              <a href="https://www.youtube.com/" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
                <svg
                  className="w-[64px] h-[48px] group-hover:text-gray-800 dark:group-hover:text-gray-400" 
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="64" 
                  height="48" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <p className="mt-1 text-center">YouTube</p>
              </a>
                <a
                  href="https://www.bilibili.com"
                  className="flex flex-col items-center justify-center mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400"
                >
                  <svg
                    className="w-[48px] h-[48px] group-hover:text-gray-800 dark:group-hover:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <g fill="currentColor" transform="scale(5.33333,5.33333)">
                      <path d="M36.5,12h-7.086l3.793,-3.793c0.391,-0.391 0.391,-1.023 0,-1.414c-0.391,-0.391 -1.023,-0.391 -1.414,0l-5.207,5.207h-5.172l-5.207,-5.207c-0.391,-0.391 -1.023,-0.391 -1.414,0c-0.391,0.391 -0.391,1.023 0,1.414l3.793,3.793h-6.086c-3.033,0 -5.5,2.467 -5.5,5.5v15c0,3.033 2.467,5.5 5.5,5.5h2c0,0.829 0.671,1.5 1.5,1.5c0.829,0 1.5,-0.671 1.5,-1.5h14c0,0.829 0.671,1.5 1.5,1.5c0.829,0 1.5,-0.671 1.5,-1.5h2c3.033,0 5.5,-2.467 5.5,-5.5v-15c0,-3.033 -2.467,-5.5 -5.5,-5.5zM39,32.5c0,1.378 -1.122,2.5 -2.5,2.5h-24c-1.378,0 -2.5,-1.122 -2.5,-2.5v-15c0,-1.378 1.122,-2.5 2.5,-2.5h24c1.378,0 2.5,1.122 2.5,2.5z"></path>
                      <rect x="-12.1287" y="33.77846" transform="rotate(-71.567)" width="2.75" height="7.075"></rect>
                      <rect x="6.58471" y="25.18713" transform="rotate(-18.432)" width="7.075" height="2.75"></rect>
                      <path d="M28.033,27.526c-0.189,0.593 -0.644,0.896 -1.326,0.896c-0.076,-0.013 -0.139,-0.013 -0.24,-0.025c-0.013,0 -0.05,-0.013 -0.063,0c-0.341,-0.05 -0.745,-0.177 -1.061,-0.467c-0.366,-0.265 -0.808,-0.745 -0.947,-1.477c0,0 -0.29,1.174 -0.896,1.49c-0.076,0.05 -0.164,0.114 -0.253,0.164l-0.038,0.025c-0.303,0.164 -0.682,0.265 -1.086,0.278c-0.568,-0.051 -0.947,-0.328 -1.136,-0.821l-0.063,-0.164l-1.427,0.656l0.05,0.139c0.467,1.124 1.465,1.768 2.74,1.768c0.922,0 1.667,-0.303 2.209,-0.909c0.556,0.606 1.288,0.909 2.209,0.909c1.856,0 2.55,-1.288 2.765,-1.843l0.051,-0.126l-1.427,-0.657z"></path>
                    </g>
                  </svg>
                  <p className="mt-1 text-center">BiliBili</p>
                </a>
                <a href="https://arxiv.org" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
                  <svg id="primary_logo_-_single_color" data-name="primary logo - single color" className="w-[48px] h-[48px] group-hover:text-gray-800 dark:group-hover:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="100" fill="currentColor" viewBox="0 0 246.978 110.119">
    <path d="M492.976,269.5l24.36-29.89c1.492-1.989,2.2-3.03,1.492-4.723a5.142,5.142,0,0,0-4.481-3.161h0a4.024,4.024,0,0,0-3.008,1.108L485.2,261.094Z" transform="translate(-358.165 -223.27)"/><path d="M526.273,325.341,493.91,287.058l-.972,1.033-7.789-9.214-7.743-9.357-4.695,5.076a4.769,4.769,0,0,0,.015,6.53L520.512,332.2a3.913,3.913,0,0,0,3.137,1.192,4.394,4.394,0,0,0,4.027-2.818C528.4,328.844,527.6,327.133,526.273,325.341Z" transform="translate(-358.165 -223.27)"/><path d="M479.215,288.087l6.052,6.485L458.714,322.7a2.98,2.98,0,0,1-2.275,1.194,3.449,3.449,0,0,1-3.241-2.144c-.513-1.231.166-3.15,1.122-4.168l.023-.024.021-.026,24.851-29.448m-.047-1.882-25.76,30.524c-1.286,1.372-2.084,3.777-1.365,5.5a4.705,4.705,0,0,0,4.4,2.914,4.191,4.191,0,0,0,3.161-1.563l27.382-29.007-7.814-8.372Z" transform="translate(-358.165 -223.27)"/><path d="M427.571,255.154c1.859,0,3.1,1.24,3.985,3.453,1.062-2.213,2.568-3.453,4.694-3.453h14.878a4.062,4.062,0,0,1,4.074,4.074v7.828c0,2.656-1.327,4.074-4.074,4.074-2.656,0-4.074-1.418-4.074-4.074V263.3H436.515a2.411,2.411,0,0,0-2.656,2.745v27.188h10.007c2.658,0,4.074,1.329,4.074,4.074s-1.416,4.074-4.074,4.074h-26.39c-2.659,0-3.986-1.328-3.986-4.074s1.327-4.074,3.986-4.074h8.236V263.3h-7.263c-2.656,0-3.985-1.329-3.985-4.074,0-2.658,1.329-4.074,3.985-4.074Z" transform="translate(-358.165 -223.27)"/><path d="M539.233,255.154c2.656,0,4.074,1.416,4.074,4.074v34.007h10.1c2.746,0,4.074,1.329,4.074,4.074s-1.328,4.074-4.074,4.074H524.8c-2.656,0-4.074-1.328-4.074-4.074s1.418-4.074,4.074-4.074h10.362V263.3h-8.533c-2.744,0-4.073-1.329-4.073-4.074,0-2.658,1.329-4.074,4.073-4.074Zm4.22-17.615a5.859,5.859,0,1,1-5.819-5.819A5.9,5.9,0,0,1,543.453,237.539Z" transform="translate(-358.165 -223.27)"/><path d="M605.143,259.228a4.589,4.589,0,0,1-.267,1.594L590,298.9a3.722,3.722,0,0,1-3.721,2.48h-5.933a3.689,3.689,0,0,1-3.808-2.48l-15.055-38.081a3.23,3.23,0,0,1-.355-1.594,4.084,4.084,0,0,1,4.164-4.074,3.8,3.8,0,0,1,3.718,2.656l14.348,36.134,13.9-36.134a3.8,3.8,0,0,1,3.72-2.656A4.084,4.084,0,0,1,605.143,259.228Z" transform="translate(-358.165 -223.27)"/><path d="M390.61,255.154c5.018,0,8.206,3.312,8.206,8.4v37.831H363.308a4.813,4.813,0,0,1-5.143-4.929V283.427a8.256,8.256,0,0,1,7-8.148l25.507-3.572v-8.4H362.306a4.014,4.014,0,0,1-4.141-4.074c0-2.87,2.143-4.074,4.355-4.074Zm.059,38.081V279.942l-24.354,3.4v9.9Z" transform="translate(-358.165 -223.27)"/><path d="M448.538,224.52h.077c1,.024,2.236,1.245,2.589,1.669l.023.028.024.026,46.664,50.433a3.173,3.173,0,0,1-.034,4.336l-4.893,5.2-6.876-8.134L446.652,230.4c-1.508-2.166-1.617-2.836-1.191-3.858a3.353,3.353,0,0,1,3.077-2.02m0-1.25a4.606,4.606,0,0,0-4.231,2.789c-.705,1.692-.2,2.88,1.349,5.1l39.493,47.722,7.789,9.214,5.853-6.221a4.417,4.417,0,0,0,.042-6.042L452.169,225.4s-1.713-2.08-3.524-2.124Z" transform="translate(-358.165 -223.27)"/>
                  </svg>
                  <p className="mt-1 text-center">arxiv</p>
                </a>
                <a href="https://www.google.com.hk/url?sa=t&source=web&rct=j&opi=89978449&url=http://github.com/&ved=2ahUKEwivqJ-C27aJAxXwSmwGHXxRHZcQ-TAoAHoECCsQAQ&usg=AOvVaw2c9RU0BlmsEgnwc62XUlEM" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
                  <svg className="w-[48px] h-[48px] group-hover:text-gray-800 dark:group-hover:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd" />
                  </svg>
                  <p className="mt-1 text-center">GitHub</p>
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;

