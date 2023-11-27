'use client'
import * as React from "react";

function page(props) {
  return (
    <>
      <div className="main-container">
        <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6e16687-f6a8-4dc8-b605-22954371e851?apiKey=bee3fd91b75444a9968cbe246de70eb0&"className="image-wrapper" />
        <div className="div-2">
          <div className="div-3">Algebra</div>
          <div className="div-4">
            <div className="div-5">Date: 14/09/2023</div>
            <div className="div-6">Open</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .main-container {
          border-radius: 10px;
          box-shadow: 6px 6px 8px 1px #fff, -1px -1px 4px 0px #fff;
          background-color: var(--secondary);
          display: flex;
          flex-grow: 1;
          padding: 12px;
          flex-direction: column;
          width: 350px;
          margin: 0 auto;
        }

        @media (max-width: 991px) {
          .main-container {
            margin-top: 40px;
          }
        }

        .image-wrapper {
          aspect-ratio: 1.85;
          object-fit: contain;
          object-position: center;
          width: 100%;
          overflow: hidden;
        }

        .div-2 {
          display: flex;
          margin-top: 26px;
          flex-direction: column;
          padding: 0 20px;
        }

        .div-3 {
          color: #fff;
          letter-spacing: -0.8px;
          white-space: nowrap;
          font: 500 40px/47px Karla, -apple-system, Roboto, Helvetica, sans-serif;
        }

        @media (max-width: 991px) {
          .div-3 {
            white-space: initial;
          }
        }

        .div-4 {
          display: flex;
          margin-top: 4px;
          padding-right: 2px;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
        }

        .div-5 {
          color: #fff;
          letter-spacing: -0.4px;
          margin-top: 23px;
          font: 500 20px/23px Karla, -apple-system, Roboto, Helvetica, sans-serif;
        }

        .div-6 {
          color: #fff;
          letter-spacing: -0.56px;
          white-space: nowrap;
          border-radius: 10px;
          background-color: #5d64ff;
          align-self: stretch;
          flex-grow: 1;
          align-items: center;
          padding: 12px 20px 4px;
          font: 500 28px/33px Karla, -apple-system, Roboto, Helvetica, sans-serif;
        }

        @media (max-width: 991px) {
          .div-6 {
            white-space: initial;
          }
        }
      `}</style>
    </>
  );
}
export default page