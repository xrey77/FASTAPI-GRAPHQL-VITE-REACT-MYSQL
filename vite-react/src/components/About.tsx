import Footer from "./Footer.tsx";

export default function About() {
  return (
    <>
<div className="card bg-dark border-0 mt-3 about">
  <img src="/static/images/about.jpeg" className="card-img " alt="..."/>
  <div className="card-body">
  </div>
  <div className="card-footer">
  <h2 className="card-title text-white card-x embossed">About Us</h2>
    <p className="card-text text-white card-x">
    Diebold-Nixdor former Wincor-Nixdorf is now two companies: Diebold-Nixdorf (focused on banking, retail, and restaurant software and services) and Wincor-Nixdorf (which provides automated teller machine, or ATM, operations and solutions). Formerly known as Wincor-Nixdorf, the split occurred in 2023 to allow each business to focus on their respective industries.  

      </p>
    <p className="card-text"><small>Last updated 3 mins ago</small></p>

  </div>
</div> 
<div className="w-80 fixed-bottom">   
<Footer/>
</div>
</>
  )
}
